import * as dgram from 'dgram';
import * as utils from './lib/utils';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import ldDefaults from 'lodash/defaults';
import { logger } from './lib/logger';
import { Light } from './light';
import {
	PACKET_TRANSACTION_TYPES,
	PACKET_HEADER_SEQUENCE_MAX,
	PACKET_DEFAULT_SORUCE,
	bufferToObject,
	objectToBuffer,
	createObject,
	getPacketBodyHandlerByType,
	getPacketBodyHandlerByName
} from './lib/packet';
import { HSBK_MAXIMUM_RAW, packetToNormalisedHSBK } from './packets/color/colorHSBK';
import { ServiceType } from './packets/service/service';
import { MessagePackHandler, MessagePack, RInfo } from './lib/messagePack';
import { packet } from './packets/packets';
import { AddressInfo } from 'net';
import { isIpv4Format } from './lib/utils';

import { ServiceErrorBuilder } from './lib/error';
import {
	ER_CLIENT_SOCKET_ERROR,
	ER_CLIENT_MESSAGE_PROCESS,
	ER_CLIENT_NO_RESPONSE,
	ER_CLIENT_SOCKET_PORT_RANGE,
	ER_CLIENT_SOCKET_IP_PROTOCOL,
	ER_CLIENT_INVALID_CONFIG,
	ER_CLIENT_SOCKET_UNBOUND,
	ER_CLIENT_INVALID_ARGUMENT,
	ER_CLIENT_LIGHT_NOT_FOUND
} from './errors/clientErrors';
import EventEmitter from "events";

export const MINIMUM_PORT_NUMBER = 1;
export const MAXIMUM_PORT_NUMBER = 65535;

export const DEFAULT_PROVISIONING_DELAY = 5000;
export const DEFAULT_PORT = 56700;
export const DEFAULT_BROADCAST_PORT = 56800;
export const DEFAULT_MSG_RATE_LIMIT = 100;
export const DEFAULT_MSG_DISCOVERY_INTERVAL = 5000;
export const DEFAULT_MSG_REPLY_TIMEOUT = 5000;

type Devices = {
	[id: string]: Light;
};

export enum ClientEvents {
	ERROR = 'error',
	MESSAGE = 'message',
	LISTENING = 'listening',
	LIGHT_NEW = 'light-new',
	LIGHT_CONNECTIVITY = 'light-connectivity'
}

export interface ClientOptions {
	address?: string;
	port?: number;
	debug?: boolean;
	lightOfflineTolerance?: number;
	messageHandlerTimeout?: number;
	source?: string;
	startDiscovery?: boolean;
	lightAddresses?: string[];
	broadcast?: string;
	resendPacketDelay?: number;
	resendMaxTimes?: number;
}

export class Client extends EventEmitter {
	/** Client identifier */
	public source: string;

	/** List of devices discovered by client */
	public devices: Devices;

	/** Client debug flag */
	public debug: boolean;

	/** Client dgram socket instance */
	private _socket: dgram.Socket;

	/** Client dgram socket port number */
	private _port: number;

	/** Client sgram docket */
	private _isSocketBound: boolean;

	/** List of messages to be sent queued on client */
	private _messagePackQueue: MessagePack[];

	/** Timer to handle rate limit of messages that will be sent */
	private _sendTimer: NodeJS.Timeout;

	/** Timer to handle the discovery packet broadcast interval */
	private _discoveryTimer: NodeJS.Timeout;

	/** Reference number to the last discovery paccket sent */
	private _discoveryPacketSequence: number;

	/** Reference number to the last message sent */
	private _sequenceNumber: number;

	/** Light offline tolerance in msg count */
	private _lightOfflineTolerance: number;

	/** Message handler timeout in milliseconds */
	private _messagePackHandlerTimeout: number;

	/** Time interval to resend the same packet if it failed */
	private _resendPacketDelay: number;

	/** Maximum number of attepts to resend the same packet if it failed previously */
	private _resendMaxTimes: number;

	/** Client socket broadcast address */
	private _broadcastAddress: string;

	/** List of predefined message handlers */
	private _messagePackHandlers: MessagePackHandler[];

	public constructor(params?: ClientOptions, callback?: Function) {
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

		const defaults: ClientOptions = {
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

		const opts: ClientOptions = ldDefaults(params, defaults);

		this.validateClientOptions(opts);

		this.debug = opts.debug;
		this._lightOfflineTolerance = opts.lightOfflineTolerance;
		this._messagePackHandlerTimeout = opts.messageHandlerTimeout;
		this._resendPacketDelay = opts.resendPacketDelay;
		this._resendMaxTimes = opts.resendMaxTimes;
		this._broadcastAddress = opts.broadcast;

		this._socket.on(
			ClientEvents.ERROR,
			function (error: Error) {
				const clientError = new ServiceErrorBuilder(ER_CLIENT_SOCKET_ERROR).withInnerError(error).build();

				this._isSocketBound = false;
				this._socket.close();
				this.emit(ClientEvents.ERROR, clientError);
			}.bind(this)
		);

		this._socket.on(
			ClientEvents.MESSAGE,
			function (rawMsg: Buffer, rinfo: RInfo) {
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
				} catch (err) {
					const e = new ServiceErrorBuilder(ER_CLIENT_MESSAGE_PROCESS)
						.withContextualMessage(`Packet: ${rawMsg.toString('hex')}`)
						.withInnerError(err)
						.build();

					e.log();
				}
			}.bind(this)
		);

		this._socket.bind(
			opts.port,
			opts.address,
			function () {
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
			}.bind(this)
		);
	}

	private validateClientOptions(opts: ClientOptions) {
		if (opts.port) {
			if (opts.port > MAXIMUM_PORT_NUMBER || opts.port < MINIMUM_PORT_NUMBER) {
				throw new ServiceErrorBuilder(ER_CLIENT_SOCKET_PORT_RANGE)
					.withContextualMessage(
						'LIFX Client port option must be between ' + MINIMUM_PORT_NUMBER + ' and ' + MAXIMUM_PORT_NUMBER
					)
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
						.withContextualMessage(
							`LIFX Client lights option array element ${lightAddress} is not expected IPv4 format`
						)
						.build();
				}
			});
		}

		if (opts.source !== '') {
			if (/^[0-9A-F]{8}$/.test(opts.source)) {
				this.source = opts.source;
			} else {
				throw new ServiceErrorBuilder(ER_CLIENT_INVALID_CONFIG)
					.withContextualMessage('LIFX Client source option must be 8 hex chars')
					.build();
			}
		}
	}

	public destroy() {
		this.stopDiscovery();
		this.stopSendingProcess();
		if (this._isSocketBound) {
			this._socket.close();
		}
		process.exit(1);
	}

	public sendingProcess() {
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

		const msgPack: MessagePack = this._messagePackQueue.pop();

		if (!msgPack.targetAddress) {
			msgPack.targetAddress = this._broadcastAddress;
		}

		if (msgPack.transactionType === PACKET_TRANSACTION_TYPES.ONE_WAY) {
			this._socket.send(msgPack.payload as any, 0, msgPack.payload.length, this._port, msgPack.targetAddress);
			if (this.debug) {
				logger.info('DEBUG - ' + msgPack.payload.toString('hex') + ' to ' + msgPack.targetAddress);
			}
		} else if (msgPack.transactionType === PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE) {
			if (msgPack.sendAttempts < this._resendMaxTimes) {
				if (Date.now() > msgPack.lastSentAt + this._resendPacketDelay) {
					this._socket.send(msgPack.payload as any, 0, msgPack.payload.length, this._port, msgPack.targetAddress);
					msgPack.sendAttempts += 1;
					msgPack.lastSentAt = Date.now();
					if (this.debug) {
						logger.info(
							'DEBUG - ' +
							msgPack.payload.toString('hex') +
							' to ' +
							msgPack.targetAddress +
							', send ' +
							msgPack.sendAttempts +
							' time(s)'
						);
					}
				}

				/** Add to the end of the queue again */
				this._messagePackQueue.unshift(msgPack);
			} else {
				this._messagePackHandlers.forEach(
					async function (handler: MessagePackHandler, hdlrIndex: number) {
						if (
							handler.name === packet.acknowledgement.name &&
							handler.sequenceNumber === msgPack.sequenceNumber
						) {
							this._messageHandlers.splice(hdlrIndex, 1);

							const error = new ServiceErrorBuilder(ER_CLIENT_NO_RESPONSE)
								.withContextualMessage(
									`No response after max resend limit of ${this._resendMaxTimes} Handler: ${handler.name
									}`
								)
								.build();

							error.log();
						}
					}.bind(this)
				);
			}
		}
	}

	public startSendingProcess() {
		if (!this._sendTimer) {
			this._sendTimer = setInterval(this.sendingProcess.bind(this), DEFAULT_MSG_RATE_LIMIT);
		}
	}

	public stopSendingProcess() {
		if (this._sendTimer) {
			clearInterval(this._sendTimer);
			this._sendTimer = null;
		}
	}

	private sendBroadcastDiscoveryPacket(lights?: string[]) {
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
		} else {
			this._discoveryPacketSequence += 1;
		}
	}

	public startDiscovery(lightAddresses?: string[]) {
		this._discoveryTimer = setInterval(
			this.sendBroadcastDiscoveryPacket.bind(this),
			DEFAULT_MSG_DISCOVERY_INTERVAL,
			lightAddresses
		);
		this.sendBroadcastDiscoveryPacket(lightAddresses);
	}

	public processMessagePackHandlers(msg, rinfo: RInfo) {
		/** Process only packages for us */
		if (
			msg.source.toLowerCase() !== this.source.toLowerCase() &&
			msg.source.toLowerCase() !== PACKET_DEFAULT_SORUCE &&
			msg.sequence !== 0
		) {
			logger.info(`Source differs (v2) Msg Source: ${msg.source} Source: ${this.source}`);

			return;
		}

		/** Source matches and differs from PACKET_DEFAULT_SORUCE
		 *  We check our message handler if the answer received is requested
		 */

		this._messagePackHandlers.forEach(async (handler: MessagePackHandler, hdlrIndex: number) => {
			if (msg.name === handler.name) {
				if (handler.sequenceNumber) {
					/** Remove if specific Packet was request, since it should only be called once */
					this._messagePackHandlers.splice(hdlrIndex, 1);
					this._messagePackQueue.forEach(async (messagePack: MessagePack, messageIndex: number) => {
						if (
							messagePack.transactionType === PACKET_TRANSACTION_TYPES.REQUEST_RESPONSE &&
							(msg.sequence === 0 || messagePack.sequenceNumber === msg.sequence)
						) {
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
				if (
					new Date().getUTCMilliseconds() >
					handler.createdAt.getUTCMilliseconds() + this._messagePackHandlerTimeout
				) {
					this._messagePackHandlers.splice(hdlrIndex, 1);

					return await handler.callback(
						new ServiceErrorBuilder(ER_CLIENT_NO_RESPONSE)
							.withContextualMessage(
								`No response in time. Handler: ${JSON.stringify(handler)} Rinfo: ${JSON.stringify(
									rinfo
								)}`
							)
							.build()
					);
				}
			}
		}, this);
	}

	public async processDiscoveryPacket(err: Error, msg, rinfo: RInfo): Promise<void> {
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
				} catch (err) {
					logger.error(err);
				}

				setTimeout(() => {
					this.emit(ClientEvents.LIGHT_NEW, lightDevice);
				}, DEFAULT_PROVISIONING_DELAY);
			} else {
				if (this.devices[msg.target].connectivity === false) {
					this.devices[msg.target].connectivity = true;

					try {
						await this.devices[msg.target].getPower();
						await this.devices[msg.target].getColor();
						await this.devices[msg.target].getLabel();
					} catch (err) {
						logger.error(err);
					}

					this.emit(ClientEvents.LIGHT_CONNECTIVITY, this.devices[msg.target]);
				}
				this.devices[msg.target].address = rinfo.address;
				this.devices[msg.target].discoveryPacketNumber = this._discoveryPacketSequence;
			}
		}
	}

	public processLabelPacket(err: Error, msg, rinfo?: RInfo) {
		if (this.devices[msg.target]) {
			this.devices[msg.target].label = msg.label;
		}
	}

	public processLightPacket(err: Error, msg, rinfo?: RInfo) {
		if (this.devices[msg.target]) {
			if (msg.power === HSBK_MAXIMUM_RAW) {
				this.devices[msg.target].power = true;
			} else {
				this.devices[msg.target].power = false;
			}
			this.devices[msg.target].color = packetToNormalisedHSBK(msg.color);
		}
	}

	public processPowerPacket(err: Error, msg, rinfo?: RInfo) {
		if (this.devices[msg.target]) {
			if (msg.power === HSBK_MAXIMUM_RAW) {
				this.devices[msg.target].power = true;
			} else {
				this.devices[msg.target].power = false;
			}
		}
	}

	public processPowerLegacyPacket(err: Error, msg, rinfo?: RInfo) {
		if (this.devices[msg.target]) {
			if (msg.power === HSBK_MAXIMUM_RAW) {
				this.devices[msg.target].power = true;
			} else {
				this.devices[msg.target].power = false;
			}
		}
	}

	public stopDiscovery() {
		clearInterval(this._discoveryTimer);
		this._discoveryTimer = null;
	}

	// eslint-disable-next-line complexity
	public send(msg, callback?: Function) {
		let targetBulb: Light;

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

		const messagePack: MessagePack = {
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
			} else {
				this.addMessageHandler(packet.acknowledgement.name, callback, msg.sequence);
			}
		}

		this._messagePackQueue.unshift(messagePack);

		/** If we would exceed the max value for the int8 field start over again */
		if (this._sequenceNumber >= PACKET_HEADER_SEQUENCE_MAX) {
			this._sequenceNumber = 0;
		} else {
			this._sequenceNumber += 1;
		}

		this.startSendingProcess();

		return this._sequenceNumber;
	}

	public getAddress() {
		return this._socket.address() as AddressInfo;
	}

	public addMessageHandler(name: string, callback: Function, sequenceNumber: number) {
		getPacketBodyHandlerByName(name);

		const messageHandler: MessagePackHandler = {
			name: name,
			createdAt: new Date(),
			callback: callback.bind(this),
			sequenceNumber
		};

		this._messagePackHandlers.push(messageHandler);
	}

	public lights(status?: boolean): Light[] {
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
	public light(identifier: string): Light {
		let light: Light;

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
