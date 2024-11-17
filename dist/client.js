import * as dgram from 'dgram';
import * as utils from './lib/utils';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import ldDefaults from 'lodash/defaults';
import { logger } from './lib/logger';
import { Light } from './light';
import { PACKET_TRANSACTION_TYPES, PACKET_HEADER_SEQUENCE_MAX, PACKET_DEFAULT_SORUCE, bufferToObject, objectToBuffer, createObject, getPacketBodyHandlerByType, getPacketBodyHandlerByName } from './lib/packet';
import { HSBK_MAXIMUM_RAW, packetToNormalisedHSBK } from './packets/color/colorHSBK';
import { ServiceType } from './packets/service/service';
import { packet } from './packets/packets';
import { isIpv4Format } from './lib/utils';
import { ServiceErrorBuilder } from './lib/error';
import { ER_CLIENT_SOCKET_ERROR, ER_CLIENT_MESSAGE_PROCESS, ER_CLIENT_NO_RESPONSE, ER_CLIENT_SOCKET_PORT_RANGE, ER_CLIENT_SOCKET_IP_PROTOCOL, ER_CLIENT_INVALID_CONFIG, ER_CLIENT_SOCKET_UNBOUND, ER_CLIENT_INVALID_ARGUMENT, ER_CLIENT_LIGHT_NOT_FOUND } from './errors/clientErrors';
import EventEmitter from "events";
export const MINIMUM_PORT_NUMBER = 1;
export const MAXIMUM_PORT_NUMBER = 65535;
export const DEFAULT_PROVISIONING_DELAY = 5000;
export const DEFAULT_PORT = 56700;
export const DEFAULT_BROADCAST_PORT = 56800;
export const DEFAULT_MSG_RATE_LIMIT = 100;
export const DEFAULT_MSG_DISCOVERY_INTERVAL = 5000;
export const DEFAULT_MSG_REPLY_TIMEOUT = 5000;
export var ClientEvents;
(function (ClientEvents) {
    ClientEvents["ERROR"] = "error";
    ClientEvents["MESSAGE"] = "message";
    ClientEvents["LISTENING"] = "listening";
    ClientEvents["LIGHT_NEW"] = "light-new";
    ClientEvents["LIGHT_CONNECTIVITY"] = "light-connectivity";
})(ClientEvents || (ClientEvents = {}));
export class Client extends EventEmitter {
    /** Client identifier */
    source;
    /** List of devices discovered by client */
    devices;
    /** Client debug flag */
    debug;
    /** Client dgram socket instance */
    _socket;
    /** Client dgram socket port number */
    _port;
    /** Client sgram docket */
    _isSocketBound;
    /** List of messages to be sent queued on client */
    _messagePackQueue;
    /** Timer to handle rate limit of messages that will be sent */
    _sendTimer;
    /** Timer to handle the discovery packet broadcast interval */
    _discoveryTimer;
    /** Reference number to the last discovery paccket sent */
    _discoveryPacketSequence;
    /** Reference number to the last message sent */
    _sequenceNumber;
    /** Light offline tolerance in msg count */
    _lightOfflineTolerance;
    /** Message handler timeout in milliseconds */
    _messagePackHandlerTimeout;
    /** Time interval to resend the same packet if it failed */
    _resendPacketDelay;
    /** Maximum number of attepts to resend the same packet if it failed previously */
    _resendMaxTimes;
    /** Client socket broadcast address */
    _broadcastAddress;
    /** List of predefined message handlers */
    _messagePackHandlers;
    constructor(params, callback) {
        super();
        this.debug = false;
        this.source = utils.getRandomHexString(8);
        this.devices = {};
        this._socket = dgram.createSocket('udp4');
        this._isSocketBound = false;
        this._messagePackQueue = [];
        this._discoveryPacketSequence = 0;
        this._sequenceNumber = 0;
        this._lightOfflineTolerance = 3;
        this._messagePackHandlerTimeout = 20000;
        this._resendPacketDelay = 150;
        this._resendMaxTimes = 3;
        this._broadcastAddress = '255.255.255.255';
        this._messagePackHandlers = [
            {
                createdAt: new Date(),
                name: packet.stateService.name,
                callback: this.processDiscoveryPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packet.stateLabel.name,
                callback: this.processLabelPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packet.stateLight.name,
                callback: this.processLightPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packet.statePower.name,
                callback: this.processPowerPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packet.statePowerLegacy.name,
                callback: this.processPowerLegacyPacket.bind(this)
            }
        ];
        const defaults = {
            address: '0.0.0.0',
            port: DEFAULT_PORT,
            debug: false,
            lightOfflineTolerance: 3,
            messageHandlerTimeout: 45000,
            source: '',
            startDiscovery: true,
            lightAddresses: [],
            broadcast: '255.255.255.255',
            resendPacketDelay: 150,
            resendMaxTimes: 3
        };
        const opts = ldDefaults(params, defaults);
        this.validateClientOptions(opts);
        this.debug = opts.debug;
        this._lightOfflineTolerance = opts.lightOfflineTolerance;
        this._messagePackHandlerTimeout = opts.messageHandlerTimeout;
        this._resendPacketDelay = opts.resendPacketDelay;
        this._resendMaxTimes = opts.resendMaxTimes;
        this._broadcastAddress = opts.broadcast;
        this._socket.on(ClientEvents.ERROR, function (error) {
            const clientError = new ServiceErrorBuilder(ER_CLIENT_SOCKET_ERROR).withInnerError(error).build();
            this._isSocketBound = false;
            this._socket.close();
            this.emit(ClientEvents.ERROR, clientError);
        }.bind(this));
        this._socket.on(ClientEvents.MESSAGE, function (rawMsg, rinfo) {
            try {
                if (utils.getHostIPs().indexOf(rinfo.address) >= 0) {
                    if (this._debug) {
                        logger.debug('Detected own message: ', rawMsg.toString('hex'));
                    }
                    return;
                }
                if (this._debug) {
                    logger.debug('DEBUG - ' + rawMsg.toString('hex') + ' from ' + rinfo.address);
                }
                const parsedMsg = bufferToObject(rawMsg);
                const packetHandler = getPacketBodyHandlerByType(parsedMsg.type);
                parsedMsg.name = packetHandler.name;
                this.processMessagePackHandlers(parsedMsg, rinfo);
                this.emit(ClientEvents.MESSAGE, parsedMsg, rinfo);
            }
            catch (err) {
                const e = new ServiceErrorBuilder(ER_CLIENT_MESSAGE_PROCESS)
                    .withContextualMessage(`Packet: ${rawMsg.toString('hex')}`)
                    .withInnerError(err)
                    .build();
                e.log();
            }
        }.bind(this));
        this._socket.bind(opts.port, opts.address, function () {
            this._port = opts.port;
            this._isSocketBound = true;
            this._socket.setBroadcast(true);
            this.emit(ClientEvents.LISTENING);
            if (opts.startDiscovery) {
                this.startDiscovery(opts.lightAddresses);
            }
            if (callback) {
                return callback();
            }
        }.bind(this));
    }
    validateClientOptions(opts) {
        if (opts.port) {
            if (opts.port > MAXIMUM_PORT_NUMBER || opts.port < MINIMUM_PORT_NUMBER) {
                throw new ServiceErrorBuilder(ER_CLIENT_SOCKET_PORT_RANGE)
                    .withContextualMessage('LIFX Client port option must be between ' + MINIMUM_PORT_NUMBER + ' and ' + MAXIMUM_PORT_NUMBER)
                    .build();
            }
        }
        if (opts.broadcast) {
            if (!isIpv4Format(opts.broadcast)) {
                throw new ServiceErrorBuilder(ER_CLIENT_SOCKET_IP_PROTOCOL)
                    .withContextualMessage('LIFX Client broadcast option does only allow IPv4 address format')
                    .build();
            }
        }
        if (opts.lightAddresses) {
            opts.lightAddresses.forEach(function (lightAddress) {
                if (!isIpv4Format(lightAddress)) {
                    throw new ServiceErrorBuilder(ER_CLIENT_INVALID_CONFIG)
                        .withContextualMessage(`LIFX Client lights option array element ${lightAddress} is not expected IPv4 format`)
                        .build();
                }
            });
        }
        if (opts.source !== '') {
            if (/^[0-9A-F]{8}$/.test(opts.source)) {
                this.source = opts.source;
            }
            else {
                throw new ServiceErrorBuilder(ER_CLIENT_INVALID_CONFIG)
                    .withContextualMessage('LIFX Client source option must be 8 hex chars')
                    .build();
            }
        }
    }
    destroy() {
        this.stopDiscovery();
        this.stopSendingProcess();
        if (this._isSocketBound) {
            this._socket.close();
        }
        process.exit(1);
    }
    sendingProcess() {
        /** Check if the socket is open */
        if (!this._isSocketBound) {
            this.stopSendingProcess();
            throw new ServiceErrorBuilder(ER_CLIENT_SOCKET_UNBOUND).build();
        }
        /** Check if the queue has messages */
        if (this._messagePackQueue.length === 0) {
            this.stopSendingProcess();
            return;
        }
        const msgPack = this._messagePackQueue.pop();
        if (!msgPack.targetAddress) {
            msgPack.targetAddress = this._broadcastAddress;
        }
        if (msgPack.transactionType === PACKET_TRANSACTION_TYPES.ONE_WAY) {
            this._socket.send(msgPack.payload, 0, msgPack.payload.length, this._port, msgPack.targetAddress);
            if (this.debug) {
                logger.info('DEBUG - ' + msgPack.payload.toString('hex') + ' to ' + msgPack.targetAddress);
            }
        }
        else if (msgPack.transactionType === PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE) {
            if (msgPack.sendAttempts < this._resendMaxTimes) {
                if (Date.now() > msgPack.lastSentAt + this._resendPacketDelay) {
                    this._socket.send(msgPack.payload, 0, msgPack.payload.length, this._port, msgPack.targetAddress);
                    msgPack.sendAttempts += 1;
                    msgPack.lastSentAt = Date.now();
                    if (this.debug) {
                        logger.info('DEBUG - ' +
                            msgPack.payload.toString('hex') +
                            ' to ' +
                            msgPack.targetAddress +
                            ', send ' +
                            msgPack.sendAttempts +
                            ' time(s)');
                    }
                }
                /** Add to the end of the queue again */
                this._messagePackQueue.unshift(msgPack);
            }
            else {
                this._messagePackHandlers.forEach(async function (handler, hdlrIndex) {
                    if (handler.name === packet.acknowledgement.name &&
                        handler.sequenceNumber === msgPack.sequenceNumber) {
                        this._messageHandlers.splice(hdlrIndex, 1);
                        const error = new ServiceErrorBuilder(ER_CLIENT_NO_RESPONSE)
                            .withContextualMessage(`No response after max resend limit of ${this._resendMaxTimes} Handler: ${handler.name}`)
                            .build();
                        error.log();
                    }
                }.bind(this));
            }
        }
    }
    startSendingProcess() {
        if (!this._sendTimer) {
            this._sendTimer = setInterval(this.sendingProcess.bind(this), DEFAULT_MSG_RATE_LIMIT);
        }
    }
    stopSendingProcess() {
        if (this._sendTimer) {
            clearInterval(this._sendTimer);
            this._sendTimer = null;
        }
    }
    sendBroadcastDiscoveryPacket(lights) {
        /** Sign flag on inactive lights */
        forEach(this.devices, (light) => {
            if (this.devices[light.id].connectivity !== false) {
                const diff = this._discoveryPacketSequence - light.discoveryPacketNumber;
                if (diff >= this._lightOfflineTolerance) {
                    this.devices[light.id].connectivity = false;
                    this.emit(ClientEvents.LIGHT_CONNECTIVITY, light);
                }
            }
        });
        /** Send a discovery Packet broadcast */
        const broadcastGetService = createObject(packet.getService.type, {}, this.source);
        this.send(broadcastGetService);
        if (lights) {
            /** Send a discovery Packet to each light given directly */
            lights.forEach(function (lightAddress) {
                const msg = createObject(packet.getService.type, {}, this.source);
                msg.target = lightAddress;
                this.send(msg);
            }, this);
        }
        /** Keep track of a sequent number to find not answering lights */
        if (this._discoveryPacketSequence >= Number.MAX_VALUE) {
            this._discoveryPacketSequence = 0;
        }
        else {
            this._discoveryPacketSequence += 1;
        }
    }
    startDiscovery(lightAddresses) {
        this._discoveryTimer = setInterval(this.sendBroadcastDiscoveryPacket.bind(this), DEFAULT_MSG_DISCOVERY_INTERVAL, lightAddresses);
        this.sendBroadcastDiscoveryPacket(lightAddresses);
    }
    processMessagePackHandlers(msg, rinfo) {
        /** Process only packages for us */
        if (msg.source.toLowerCase() !== this.source.toLowerCase() &&
            msg.source.toLowerCase() !== PACKET_DEFAULT_SORUCE &&
            msg.sequence !== 0) {
            logger.info(`Source differs (v2) Msg Source: ${msg.source} Source: ${this.source}`);
            return;
        }
        /** Source matches and differs from PACKET_DEFAULT_SORUCE
         *  We check our message handler if the answer received is requested
         */
        this._messagePackHandlers.forEach(async (handler, hdlrIndex) => {
            if (msg.name === handler.name) {
                if (handler.sequenceNumber) {
                    /** Remove if specific Packet was request, since it should only be called once */
                    this._messagePackHandlers.splice(hdlrIndex, 1);
                    this._messagePackQueue.forEach(async (messagePack, messageIndex) => {
                        if (messagePack.transactionType === PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE &&
                            (msg.sequence === 0 || messagePack.sequenceNumber === msg.sequence)) {
                            this._messagePackQueue.splice(messageIndex, 1);
                        }
                    });
                }
                await handler.callback(null, msg, rinfo);
            }
            /** We want to call expired request handlers for specific packages after the
             *  _messagePackHandlerTimeout set in options, to specify an error
             */
            if (handler.sequenceNumber) {
                if (new Date().getUTCMilliseconds() >
                    handler.createdAt.getUTCMilliseconds() + this._messagePackHandlerTimeout) {
                    this._messagePackHandlers.splice(hdlrIndex, 1);
                    return await handler.callback(new ServiceErrorBuilder(ER_CLIENT_NO_RESPONSE)
                        .withContextualMessage(`No response in time. Handler: ${JSON.stringify(handler)} Rinfo: ${JSON.stringify(rinfo)}`)
                        .build());
                }
            }
        }, this);
    }
    async processDiscoveryPacket(err, msg, rinfo) {
        if (msg.service === ServiceType.UDP && msg.port === DEFAULT_PORT) {
            /** Add / update the found gateway */
            let legacy = false;
            if (msg.source === PACKET_DEFAULT_SORUCE) {
                legacy = true;
            }
            if (!this.devices[msg.target]) {
                const lightDevice = new Light({
                    client: this,
                    id: msg.target,
                    address: rinfo.address,
                    port: msg.port,
                    discoveryPacketNumber: this._discoveryPacketSequence,
                    legacy: legacy
                });
                this.devices[msg.target] = lightDevice;
                try {
                    await this.devices[msg.target].getPower();
                    await this.devices[msg.target].getColor();
                    await this.devices[msg.target].getLabel();
                }
                catch (err) {
                    logger.error(err);
                }
                setTimeout(() => {
                    this.emit(ClientEvents.LIGHT_NEW, lightDevice);
                }, DEFAULT_PROVISIONING_DELAY);
            }
            else {
                if (this.devices[msg.target].connectivity === false) {
                    this.devices[msg.target].connectivity = true;
                    try {
                        await this.devices[msg.target].getPower();
                        await this.devices[msg.target].getColor();
                        await this.devices[msg.target].getLabel();
                    }
                    catch (err) {
                        logger.error(err);
                    }
                    this.emit(ClientEvents.LIGHT_CONNECTIVITY, this.devices[msg.target]);
                }
                this.devices[msg.target].address = rinfo.address;
                this.devices[msg.target].discoveryPacketNumber = this._discoveryPacketSequence;
            }
        }
    }
    processLabelPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            this.devices[msg.target].label = msg.label;
        }
    }
    processLightPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            if (msg.power === HSBK_MAXIMUM_RAW) {
                this.devices[msg.target].power = true;
            }
            else {
                this.devices[msg.target].power = false;
            }
            this.devices[msg.target].color = packetToNormalisedHSBK(msg.color);
        }
    }
    processPowerPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            if (msg.power === HSBK_MAXIMUM_RAW) {
                this.devices[msg.target].power = true;
            }
            else {
                this.devices[msg.target].power = false;
            }
        }
    }
    processPowerLegacyPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            if (msg.power === HSBK_MAXIMUM_RAW) {
                this.devices[msg.target].power = true;
            }
            else {
                this.devices[msg.target].power = false;
            }
        }
    }
    stopDiscovery() {
        clearInterval(this._discoveryTimer);
        this._discoveryTimer = null;
    }
    // eslint-disable-next-line complexity
    send(msg, callback) {
        let targetBulb;
        if (msg.target) {
            targetBulb = this.light(msg.target);
        }
        if (targetBulb) {
            if (targetBulb.legacy) {
                msg.site = msg.target;
            }
        }
        if (!msg.site) {
            msg.sequence = this._sequenceNumber;
            if (callback) {
                msg.ackRequired = true;
            }
        }
        const messagePack = {
            targetAddress: targetBulb ? targetBulb.address : msg.target,
            payload: objectToBuffer(msg),
            sequenceNumber: !msg.site ? this._sequenceNumber : undefined,
            createdAt: new Date(),
            lastSentAt: 0,
            sendAttempts: 0,
            transactionType: !msg.site ? PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE : PACKET_TRANSACTION_TYPES.ONE_WAY
        };
        if (callback) {
            if (msg.site) {
                callback(null);
            }
            else {
                this.addMessageHandler(packet.acknowledgement.name, callback, msg.sequence);
            }
        }
        this._messagePackQueue.unshift(messagePack);
        /** If we would exceed the max value for the int8 field start over again */
        if (this._sequenceNumber >= PACKET_HEADER_SEQUENCE_MAX) {
            this._sequenceNumber = 0;
        }
        else {
            this._sequenceNumber += 1;
        }
        this.startSendingProcess();
        return this._sequenceNumber;
    }
    getAddress() {
        return this._socket.address();
    }
    addMessageHandler(name, callback, sequenceNumber) {
        getPacketBodyHandlerByName(name);
        const messageHandler = {
            name: name,
            createdAt: new Date(),
            callback: callback.bind(this),
            sequenceNumber
        };
        this._messagePackHandlers.push(messageHandler);
    }
    lights(status) {
        const lights = [];
        if (!status) {
            forEach(this.devices, function (light) {
                lights.push(light);
            });
            return lights;
        }
        forEach(this.devices, (light) => {
            if (light.connectivity === status) {
                lights.push(light);
            }
        });
        return lights;
    }
    //eslint-disable-next-line complexity
    light(identifier) {
        let light;
        /** There is no ip or id longer than 45 chars, no label longer than 32 bit */
        if (identifier.length > 45 && Buffer.byteLength(identifier, 'utf8') > 32) {
            throw new ServiceErrorBuilder(ER_CLIENT_INVALID_ARGUMENT)
                .withContextualMessage('There is no ip or id longer than 45 chars, no label longer than 32 bit')
                .build();
        }
        /** Dots or colons is high likely an IP Address */
        if (identifier.indexOf('.') >= 0 || identifier.indexOf(':') >= 0) {
            light = find(this.devices, { address: identifier });
            if (light) {
                return light;
            }
        }
        /** Search id */
        light = find(this.devices, { id: identifier });
        if (light) {
            return light;
        }
        /** Search label */
        light = find(this.devices, { label: identifier });
        if (light) {
            return light;
        }
        throw new ServiceErrorBuilder(ER_CLIENT_LIGHT_NOT_FOUND).build();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEtBQUssS0FBSyxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLE9BQU8sTUFBTSxnQkFBZ0IsQ0FBQztBQUNyQyxPQUFPLElBQUksTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxVQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFDTix3QkFBd0IsRUFDeEIsMEJBQTBCLEVBQzFCLHFCQUFxQixFQUNyQixjQUFjLEVBQ2QsY0FBYyxFQUNkLFlBQVksRUFDWiwwQkFBMEIsRUFDMUIsMEJBQTBCLEVBQzFCLE1BQU0sY0FBYyxDQUFDO0FBQ3RCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUUzQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbEQsT0FBTyxFQUNOLHNCQUFzQixFQUN0Qix5QkFBeUIsRUFDekIscUJBQXFCLEVBQ3JCLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsd0JBQXdCLEVBQ3hCLHdCQUF3QixFQUN4QiwwQkFBMEIsRUFDMUIseUJBQXlCLEVBQ3pCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxZQUFZLE1BQU0sUUFBUSxDQUFDO0FBRWxDLE1BQU0sQ0FB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