"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.ClientEvents = exports.DEFAULT_MSG_REPLY_TIMEOUT = exports.DEFAULT_MSG_DISCOVERY_INTERVAL = exports.DEFAULT_MSG_RATE_LIMIT = exports.DEFAULT_BROADCAST_PORT = exports.DEFAULT_PORT = exports.DEFAULT_PROVISIONING_DELAY = exports.MAXIMUM_PORT_NUMBER = exports.MINIMUM_PORT_NUMBER = void 0;
const dgram = require("dgram");
const _ = require("lodash");
const utils = require("./lib/utils");
const eventemitter3_1 = require("eventemitter3");
const logger_1 = require("./lib/logger");
const light_1 = require("./light");
const packet_1 = require("./lib/packet");
const colorHSBK_1 = require("./packets/color/colorHSBK");
const service_1 = require("./packets/service/service");
const packets_1 = require("./packets/packets");
const utils_1 = require("./lib/utils");
const error_1 = require("./lib/error");
const clientErrors_1 = require("./errors/clientErrors");
exports.MINIMUM_PORT_NUMBER = 1;
exports.MAXIMUM_PORT_NUMBER = 65535;
exports.DEFAULT_PROVISIONING_DELAY = 5000;
exports.DEFAULT_PORT = 56700;
exports.DEFAULT_BROADCAST_PORT = 56800;
exports.DEFAULT_MSG_RATE_LIMIT = 100;
exports.DEFAULT_MSG_DISCOVERY_INTERVAL = 5000;
exports.DEFAULT_MSG_REPLY_TIMEOUT = 5000;
var ClientEvents;
(function (ClientEvents) {
    ClientEvents["ERROR"] = "error";
    ClientEvents["MESSAGE"] = "message";
    ClientEvents["LISTENING"] = "listening";
    ClientEvents["LIGHT_NEW"] = "light-new";
    ClientEvents["LIGHT_CONNECTIVITY"] = "light-connectivity";
})(ClientEvents = exports.ClientEvents || (exports.ClientEvents = {}));
class Client extends eventemitter3_1.EventEmitter {
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
                name: packets_1.packet.stateService.name,
                callback: this.processDiscoveryPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packets_1.packet.stateLabel.name,
                callback: this.processLabelPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packets_1.packet.stateLight.name,
                callback: this.processLightPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packets_1.packet.statePower.name,
                callback: this.processPowerPacket.bind(this)
            },
            {
                createdAt: new Date(),
                name: packets_1.packet.statePowerLegacy.name,
                callback: this.processPowerLegacyPacket.bind(this)
            }
        ];
        const defaults = {
            address: '0.0.0.0',
            port: exports.DEFAULT_PORT,
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
        const opts = _.defaults(params, defaults);
        this.validateClientOptions(opts);
        this.debug = opts.debug;
        this._lightOfflineTolerance = opts.lightOfflineTolerance;
        this._messagePackHandlerTimeout = opts.messageHandlerTimeout;
        this._resendPacketDelay = opts.resendPacketDelay;
        this._resendMaxTimes = opts.resendMaxTimes;
        this._broadcastAddress = opts.broadcast;
        this._socket.on(ClientEvents.ERROR, function (error) {
            const clientError = new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_SOCKET_ERROR).withInnerError(error).build();
            this._isSocketBound = false;
            this._socket.close();
            this.emit(ClientEvents.ERROR, clientError);
        }.bind(this));
        this._socket.on(ClientEvents.MESSAGE, function (rawMsg, rinfo) {
            try {
                if (utils.getHostIPs().indexOf(rinfo.address) >= 0) {
                    if (this._debug) {
                        logger_1.logger.debug('Detected own message: ', rawMsg.toString('hex'));
                    }
                    return;
                }
                if (this._debug) {
                    logger_1.logger.debug('DEBUG - ' + rawMsg.toString('hex') + ' from ' + rinfo.address);
                }
                const parsedMsg = (0, packet_1.bufferToObject)(rawMsg);
                const packetHandler = (0, packet_1.getPacketBodyHandlerByType)(parsedMsg.type);
                parsedMsg.name = packetHandler.name;
                this.processMessagePackHandlers(parsedMsg, rinfo);
                this.emit(ClientEvents.MESSAGE, parsedMsg, rinfo);
            }
            catch (err) {
                const e = new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_MESSAGE_PROCESS)
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
            if (opts.port > exports.MAXIMUM_PORT_NUMBER || opts.port < exports.MINIMUM_PORT_NUMBER) {
                throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_SOCKET_PORT_RANGE)
                    .withContextualMessage('LIFX Client port option must be between ' + exports.MINIMUM_PORT_NUMBER + ' and ' + exports.MAXIMUM_PORT_NUMBER)
                    .build();
            }
        }
        if (opts.broadcast) {
            if (!(0, utils_1.isIpv4Format)(opts.broadcast)) {
                throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_SOCKET_IP_PROTOCOL)
                    .withContextualMessage('LIFX Client broadcast option does only allow IPv4 address format')
                    .build();
            }
        }
        if (opts.lightAddresses) {
            opts.lightAddresses.forEach(function (lightAddress) {
                if (!(0, utils_1.isIpv4Format)(lightAddress)) {
                    throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_INVALID_CONFIG)
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
                throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_INVALID_CONFIG)
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
            throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_SOCKET_UNBOUND).build();
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
        if (msgPack.transactionType === packet_1.PACKET_TRANSACTION_TYPES.ONE_WAY) {
            this._socket.send(msgPack.payload, 0, msgPack.payload.length, this._port, msgPack.targetAddress);
            if (this.debug) {
                logger_1.logger.info('DEBUG - ' + msgPack.payload.toString('hex') + ' to ' + msgPack.targetAddress);
            }
        }
        else if (msgPack.transactionType === packet_1.PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE) {
            if (msgPack.sendAttempts < this._resendMaxTimes) {
                if (Date.now() > msgPack.lastSentAt + this._resendPacketDelay) {
                    this._socket.send(msgPack.payload, 0, msgPack.payload.length, this._port, msgPack.targetAddress);
                    msgPack.sendAttempts += 1;
                    msgPack.lastSentAt = Date.now();
                    if (this.debug) {
                        logger_1.logger.info('DEBUG - ' +
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
                this._messagePackHandlers.forEach(function (handler, hdlrIndex) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (handler.name === packets_1.packet.acknowledgement.name &&
                            handler.sequenceNumber === msgPack.sequenceNumber) {
                            this._messageHandlers.splice(hdlrIndex, 1);
                            const error = new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_NO_RESPONSE)
                                .withContextualMessage(`No response after max resend limit of ${this._resendMaxTimes} Handler: ${handler.name}`)
                                .build();
                            error.log();
                        }
                    });
                }.bind(this));
            }
        }
    }
    startSendingProcess() {
        if (!this._sendTimer) {
            this._sendTimer = setInterval(this.sendingProcess.bind(this), exports.DEFAULT_MSG_RATE_LIMIT);
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
        _.forEach(this.devices, (light) => {
            if (this.devices[light.id].connectivity !== false) {
                const diff = this._discoveryPacketSequence - light.discoveryPacketNumber;
                if (diff >= this._lightOfflineTolerance) {
                    this.devices[light.id].connectivity = false;
                    this.emit(ClientEvents.LIGHT_CONNECTIVITY, light);
                }
            }
        });
        /** Send a discovery Packet broadcast */
        const broadcastGetService = (0, packet_1.createObject)(packets_1.packet.getService.type, {}, this.source);
        this.send(broadcastGetService);
        if (lights) {
            /** Send a discovery Packet to each light given directly */
            lights.forEach(function (lightAddress) {
                const msg = (0, packet_1.createObject)(packets_1.packet.getService.type, {}, this.source);
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
        this._discoveryTimer = setInterval(this.sendBroadcastDiscoveryPacket.bind(this), exports.DEFAULT_MSG_DISCOVERY_INTERVAL, lightAddresses);
        this.sendBroadcastDiscoveryPacket(lightAddresses);
    }
    processMessagePackHandlers(msg, rinfo) {
        /** Process only packages for us */
        if (msg.source.toLowerCase() !== this.source.toLowerCase() &&
            msg.source.toLowerCase() !== packet_1.PACKET_DEFAULT_SORUCE &&
            msg.sequence !== 0) {
            logger_1.logger.info(`Source differs (v2) Msg Source: ${msg.source} Source: ${this.source}`);
            return;
        }
        /** Source matches and differs from PACKET_DEFAULT_SORUCE
         *  We check our message handler if the answer received is requested
         */
        this._messagePackHandlers.forEach((handler, hdlrIndex) => __awaiter(this, void 0, void 0, function* () {
            if (msg.name === handler.name) {
                if (handler.sequenceNumber) {
                    /** Remove if specific Packet was request, since it should only be called once */
                    this._messagePackHandlers.splice(hdlrIndex, 1);
                    this._messagePackQueue.forEach((messagePack, messageIndex) => __awaiter(this, void 0, void 0, function* () {
                        if (messagePack.transactionType === packet_1.PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE &&
                            (msg.sequence === 0 || messagePack.sequenceNumber === msg.sequence)) {
                            this._messagePackQueue.splice(messageIndex, 1);
                        }
                    }));
                }
                yield handler.callback(null, msg, rinfo);
            }
            /** We want to call expired request handlers for specific packages after the
             *  _messagePackHandlerTimeout set in options, to specify an error
             */
            if (handler.sequenceNumber) {
                if (new Date().getUTCMilliseconds() >
                    handler.createdAt.getUTCMilliseconds() + this._messagePackHandlerTimeout) {
                    this._messagePackHandlers.splice(hdlrIndex, 1);
                    return yield handler.callback(new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_NO_RESPONSE)
                        .withContextualMessage(`No response in time. Handler: ${JSON.stringify(handler)} Rinfo: ${JSON.stringify(rinfo)}`)
                        .build());
                }
            }
        }), this);
    }
    processDiscoveryPacket(err, msg, rinfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msg.service === service_1.ServiceType.UDP && msg.port === exports.DEFAULT_PORT) {
                /** Add / update the found gateway */
                let legacy = false;
                if (msg.source === packet_1.PACKET_DEFAULT_SORUCE) {
                    legacy = true;
                }
                if (!this.devices[msg.target]) {
                    const lightDevice = new light_1.Light({
                        client: this,
                        id: msg.target,
                        address: rinfo.address,
                        port: msg.port,
                        discoveryPacketNumber: this._discoveryPacketSequence,
                        legacy: legacy
                    });
                    this.devices[msg.target] = lightDevice;
                    try {
                        yield this.devices[msg.target].getPower();
                        yield this.devices[msg.target].getColor();
                        yield this.devices[msg.target].getLabel();
                    }
                    catch (err) {
                        logger_1.logger.error(err);
                    }
                    setTimeout(() => {
                        this.emit(ClientEvents.LIGHT_NEW, lightDevice);
                    }, exports.DEFAULT_PROVISIONING_DELAY);
                }
                else {
                    if (this.devices[msg.target].connectivity === false) {
                        this.devices[msg.target].connectivity = true;
                        try {
                            yield this.devices[msg.target].getPower();
                            yield this.devices[msg.target].getColor();
                            yield this.devices[msg.target].getLabel();
                        }
                        catch (err) {
                            logger_1.logger.error(err);
                        }
                        this.emit(ClientEvents.LIGHT_CONNECTIVITY, this.devices[msg.target]);
                    }
                    this.devices[msg.target].address = rinfo.address;
                    this.devices[msg.target].discoveryPacketNumber = this._discoveryPacketSequence;
                }
            }
        });
    }
    processLabelPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            this.devices[msg.target].label = msg.label;
        }
    }
    processLightPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            if (msg.power === colorHSBK_1.HSBK_MAXIMUM_RAW) {
                this.devices[msg.target].power = true;
            }
            else {
                this.devices[msg.target].power = false;
            }
            this.devices[msg.target].color = (0, colorHSBK_1.packetToNormalisedHSBK)(msg.color);
        }
    }
    processPowerPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            if (msg.power === colorHSBK_1.HSBK_MAXIMUM_RAW) {
                this.devices[msg.target].power = true;
            }
            else {
                this.devices[msg.target].power = false;
            }
        }
    }
    processPowerLegacyPacket(err, msg, rinfo) {
        if (this.devices[msg.target]) {
            if (msg.power === colorHSBK_1.HSBK_MAXIMUM_RAW) {
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
            payload: (0, packet_1.objectToBuffer)(msg),
            sequenceNumber: !msg.site ? this._sequenceNumber : undefined,
            createdAt: new Date(),
            lastSentAt: 0,
            sendAttempts: 0,
            transactionType: !msg.site ? packet_1.PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE : packet_1.PACKET_TRANSACTION_TYPES.ONE_WAY
        };
        if (callback) {
            if (msg.site) {
                callback(null);
            }
            else {
                this.addMessageHandler(packets_1.packet.acknowledgement.name, callback, msg.sequence);
            }
        }
        this._messagePackQueue.unshift(messagePack);
        /** If we would exceed the max value for the int8 field start over again */
        if (this._sequenceNumber >= packet_1.PACKET_HEADER_SEQUENCE_MAX) {
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
        (0, packet_1.getPacketBodyHandlerByName)(name);
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
            _.forEach(this.devices, function (light) {
                lights.push(light);
            });
            return lights;
        }
        _.forEach(this.devices, (light) => {
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
            throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_INVALID_ARGUMENT)
                .withContextualMessage('There is no ip or id longer than 45 chars, no label longer than 32 bit')
                .build();
        }
        /** Dots or colons is high likely an IP Address */
        if (identifier.indexOf('.') >= 0 || identifier.indexOf(':') >= 0) {
            light = _.find(this.devices, { address: identifier });
            if (light) {
                return light;
            }
        }
        /** Search id */
        light = _.find(this.devices, { id: identifier });
        if (light) {
            return light;
        }
        /** Search label */
        light = _.find(this.devices, { label: identifier });
        if (light) {
            return light;
        }
        throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_LIGHT_NOT_FOUND).build();
    }
}
exports.Client = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFDL0IsNEJBQTRCO0FBQzVCLHFDQUFxQztBQUNyQyxpREFBNkM7QUFDN0MseUNBQXNDO0FBQ3RDLG1DQUFnQztBQUNoQyx5Q0FTc0I7QUFDdEIseURBQXFGO0FBQ3JGLHVEQUF3RDtBQUV4RCwrQ0FBMkM7QUFFM0MsdUNBQTJDO0FBRTNDLHVDQUFrRDtBQUNsRCx3REFVK0I7QUFFbEIsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7QUFDeEIsUUFBQSxtQkFBbUIsR0FBRyxLQUFLLENBQUM7QUFFNUIsUUFBQSwwQkFBMEIsR0FBRyxJQUFJLENBQUM7QUFDbEMsUUFBQSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLFFBQUEsc0JBQXNCLEdBQUcsS0FBSyxDQUFDO0FBQy9CLFFBQUEsc0JBQXNCLEdBQUcsR0FBRyxDQUFDO0FBQzdCLFFBQUEsOEJBQThCLEdBQUcsSUFBSSxDQUFDO0FBQ3RDLFFBQUEseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBTTlDLElBQVksWUFNWDtBQU5ELFdBQVksWUFBWTtJQUN2QiwrQkFBZSxDQUFBO0lBQ2YsbUNBQW1CLENBQUE7SUFDbkIsdUNBQXVCLENBQUE7SUFDdkIsdUNBQXVCLENBQUE7SUFDdkIseURBQXlDLENBQUE7QUFDMUMsQ0FBQyxFQU5XLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBTXZCO0FBZ0JELE1BQWEsTUFBTyxTQUFRLDRCQUFZO0lBb0R2QyxZQUFtQixNQUFzQixFQUFFLFFBQW1CO1FBQzdELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxD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