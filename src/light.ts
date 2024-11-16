import * as _ from 'lodash';
import * as assert from 'assert';
import { EventEmitter } from 'eventemitter3';
import {
	ColorHSBK,
	ColorHSBKRequest,
	validateNormalisedColorHSBK,
	packetToNormalisedHSBK,
	normalisedToPacketHBSK,
	HSBK_DEFAULT_KELVIN
} from './packets/color/colorHSBK';
import {
	ApplyRequest,
	ColorZonesRequest,
	validateColorZoneIndex,
	validateColorZoneIndexOptional
} from './packets/colorZone/colorZone';
import { HSBK_MAXIMUM_RAW } from './packets/color/colorHSBK';
import { PowerRequest, POWER_MINIMUM_RAW, POWER_MAXIMUM_RAW } from './packets/power/power';
import {
	ColorInfrared,
	ColorInfraredRequest,
	validateNormalisedColorInfrared,
	normalisedToPacketInfraed,
	packetToNormalisedInfrared
} from './packets/infrared/colorInfrared';
import { packet } from './packets/packets';
import { Tag } from './packets/tag/tag';
import { TagLabels } from './packets/tagLabel/tagLabel';
import { validateNormalisedColorRgb } from './packets/colorRGBW/colorRGBW';
import { Label, LabelRequest } from './packets/label/label';
import { TimeRequest } from './packets/time/time';
import { rgbToHsb, rgbHexStringToObject } from './lib/color';
import { WaveformRequest } from './packets/waveform/waveform';
import { Client, DEFAULT_MSG_REPLY_TIMEOUT } from './client';
import { RInfo } from './lib/messagePack';
import { ServiceErrorBuilder } from './lib/error';
import { createObject } from './lib/packet';
import {
	ER_LIGHT_OFFLINE,
	ER_LIGHT_CMD_NOT_SUPPORTED,
	ER_LIGHT_CMD_TIMEOUT,
	ER_LIGHT_MISSING_CACHE
} from './errors/lightErrors';
import { ER_CLIENT_INVALID_ARGUMENT } from './errors/clientErrors';
import { SetTileState64Request, SetUserPositionRequest, StateDeviceChainResponse } from './packets/tiles/tiles';
import { Group } from './packets/group/group';

export enum LightEvents {
	CONECTIVITY = 'connectivity',
	LABEL = 'label',
	COLOR = 'color',
	STATE = 'state',
	POWER = 'power'
}

export interface LightOptions {
	client: Client;
	id: string;
	address: string;
	port: number;
	legacy: boolean;
	discoveryPacketNumber: number;
}

export class Light extends EventEmitter {
	public id: string;
	public address: string;
	public port: number;
	public legacy: boolean;
	public label: string;
	private _discoveryPacketNumber: number;
	private _client: Client;
	private _connectivity: boolean;
	private _group: Group;
	private _power: boolean;
	private _color: ColorHSBK;

	get connectivity() {
		return this._connectivity;
	}

	set connectivity(newConnectivity: boolean) {
		try {
			assert.equal(this._connectivity, newConnectivity);
		} catch (e) {
			this._connectivity = newConnectivity;
			this.emit(LightEvents.CONECTIVITY, this._connectivity);
			this.emit(LightEvents.STATE, {
				connectivity: this._connectivity,
				power: this._power,
				color: this._color
			});
		}
	}

	get power() {
		return this._power;
	}

	set power(newPower: boolean) {
		try {
			assert.equal(this._power, newPower);
		} catch (e) {
			this._power = newPower;
			this.emit(LightEvents.POWER, this._power);
			this.emit(LightEvents.STATE, {
				connectivity: this._connectivity,
				power: this._power,
				color: this._color
			});
		}
	}

	get color() {
		return this._color;
	}

	set color(newColor: ColorHSBK) {
		try {
			assert.equal(this._color.hue, newColor.hue);
			assert.equal(this._color.saturation, newColor.saturation);
			assert.equal(this._color.brightness, newColor.brightness);
			assert.equal(this._color.kelvin, newColor.kelvin);
		} catch (e) {
			this._color = newColor;
			this.emit(LightEvents.COLOR, this._color);
			this.emit(LightEvents.STATE, {
				connectivity: this._connectivity,
				power: this._power,
				color: this._color
			});
		}
	}

	get discoveryPacketNumber() {
		return this._discoveryPacketNumber;
	}

	set discoveryPacketNumber(discoveryPacketNumber: number) {
		this._discoveryPacketNumber = discoveryPacketNumber;
	}

	public constructor(params: LightOptions) {
		super();
		this.id = params.id;
		this.address = params.address;
		this.port = params.port;
		this.legacy = params.legacy;
		this._client = params.client;
		this._power = true;
		this._connectivity = true;
		this.label = '';
		this._color = {
			hue: 0,
			saturation: 0,
			brightness: 0,
			kelvin: 0
		};
		this._discoveryPacketNumber = params.discoveryPacketNumber;
	}

	public async setPower(power: boolean, duration?: number) {
		const ctx = this;

		return new Promise(function (resolve, reject) {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const cmdReq: PowerRequest = { power: power ? POWER_MAXIMUM_RAW : POWER_MINIMUM_RAW, duration };
			const packetObj = createObject(
				ctx.legacy ? packet.setPowerLegacy.type : packet.setPower.type,
				cmdReq,
				ctx._client.source,
				ctx.id
			);

			ctx._client.send(packetObj, (err: Error, msg: any, rInfo: RInfo) => {
				if (err) {
					reject(err);
				} else {
					resolve(msg);
				}
			});
		});
	}

	public getColor(cache?: boolean, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (cache === true) {
				return resolve(ctx._color);
			}

			const packetObj = createObject(packet.getLight.type, {}, ctx._client.source, ctx.id);

			if (ctx.legacy) {
				ctx._client.send(packetObj);
				if (!ctx._color) {
					return reject(new ServiceErrorBuilder(ER_LIGHT_MISSING_CACHE).build());
				}

				return resolve(ctx._color);
			}

			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateLight.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(packetToNormalisedHSBK(data.color));
				},
				sqnNumber
			);
		});
	}

	public setColor(
		hue: number,
		saturation: number,
		brightness: number,
		kelvin: number,
		duration: number = 0,
		timeout: number = DEFAULT_MSG_REPLY_TIMEOUT
	) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			validateNormalisedColorHSBK(hue, saturation, brightness, kelvin);

			const normalisedColor: ColorHSBK = {
				hue,
				saturation,
				brightness,
				kelvin
			};

			const color: ColorHSBK = normalisedToPacketHBSK(normalisedColor);

			const cmdReq: ColorHSBKRequest = { color, duration };
			const packetObj = createObject(packet.setColor.type, cmdReq, ctx._client.source, ctx.id);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.send(packetObj, (err: Error, msg: any, rInfo: RInfo) => {
				if (err) {
					return reject(err);
				}

				clearTimeout(timeoutHandle);

				return resolve(msg);
			});
		});
	}

	public async setColorRgb(
		red: number,
		green: number,
		blue: number,
		duration: number = 0,
		timeout: number = DEFAULT_MSG_REPLY_TIMEOUT
	) {
		const ctx = this;

		validateNormalisedColorRgb(red, green, blue);
		const hsbObj = rgbToHsb({ red, green, blue });

		return await ctx.setColor(
			hsbObj.hue,
			hsbObj.saturation,
			hsbObj.brightness,
			HSBK_DEFAULT_KELVIN,
			duration,
			timeout
		);
	}

	public async setColorRgbHex(hexString: string, duration: number = 0, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		const rgbObj = rgbHexStringToObject(hexString);
		const hsbObj = rgbToHsb(rgbObj);

		return await ctx.setColor(
			hsbObj.hue,
			hsbObj.saturation,
			hsbObj.brightness,
			HSBK_DEFAULT_KELVIN,
			duration,
			timeout
		);
	}

	public getTime(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!this._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getTime.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTime.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public setTime(time, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const cmdReq: TimeRequest = { time };
			const packetObj = createObject(packet.setTime.type, cmdReq, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTime.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					} else {
						clearTimeout(timeoutHandle);

						return resolve(data);
					}
				},
				sqnNumber
			);
		});
	}

	public getState(cache = false, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (cache === true) {
				return resolve({
					connectivity: ctx._connectivity,
					power: ctx._power,
					color: ctx._color
				});
			}

			const packetObj = createObject(packet.getLight.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateLight.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					const PacketColor = packetToNormalisedHSBK(data.color);

					data.color.hue = PacketColor.hue;
					data.color.saturation = PacketColor.saturation;
					data.color.brightness = PacketColor.brightness;
					ctx._power = data.power === HSBK_MAXIMUM_RAW;
					ctx._color = {
						hue: data.color.hue,
						saturation: data.color.saturation,
						brightness: data.color.brightness,
						kelvin: data.color.kelvin
					};

					return resolve({
						connectivity: ctx._connectivity,
						power: ctx._power,
						color: ctx._color
					});
				},
				sqnNumber
			);
		});
	}

	public getResetSwitchState(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getResetSwitchState.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateResetSwitch.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(!!data.switch);
				},
				sqnNumber
			);
		});
	}

	public getInfrared(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getInfrared.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateInfrared.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					const infraredColor = data as ColorInfrared;
					const irPacket = packetToNormalisedInfrared(infraredColor);

					data.brightness = irPacket.brightness;

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public setInfrared(brightness: number, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			validateNormalisedColorInfrared(brightness);

			const infraredColor: ColorInfrared = {
				brightness
			};

			const cmdReq: ColorInfraredRequest = {
				brightness: normalisedToPacketInfraed(infraredColor).brightness
			};
			const packetObj = createObject(packet.setInfrared.type, cmdReq, ctx._client.source, ctx.id);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.send(packetObj, (err: Error, data) => {
				if (err) {
					return reject(err);
				}

				clearTimeout(timeoutHandle);

				const infraredColor = data as ColorHSBK;
				const hsbk = packetToNormalisedHSBK(infraredColor);

				data.brightness = hsbk.brightness;

				return resolve(data);
			});
		});
	}

	public getHostInfo(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getHostInfo.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateHostInfo.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public getHostFirmware(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getHostFirmware.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateHostFirmware.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public getHardwareVersion(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getVersion.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateVersion.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}
					clearTimeout(timeoutHandle);

					return resolve({
						vendorId: data.vendorId,
						vendorName: data.vendorName,
						productId: data.productId,
						version: data.version
					});
				},
				sqnNumber
			);
		});
	}

	public getWifiInfo(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getWifiInfo.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateWifiInfo.name,
				(err: Error, data) => {
					if (err) {
						reject(err);
					} else {
						if (timeoutHandle) {
							clearTimeout(timeoutHandle);
						}
						resolve({
							signal: data.signal,
							tx: data.tx,
							rx: data.rx,
							mcuTemperature: data.mcuTemperature
						});
					}
				},
				sqnNumber
			);
		});
	}

	public getWifiFirmware(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getWifiFirmware.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateWifiFirmware.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve({
						build: data.build,
						install: data.install,
						majorVersion: data.majorVersion,
						minorVersion: data.minorVersion
					});
				},
				sqnNumber
			);
		});
	}

	public getLabel(cache = false, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (cache === true) {
				if (ctx.label.length > 0) {
					return resolve(ctx.label);
				}
			}

			const cmdReq: LabelRequest = { target: ctx.id };
			const packetObj = createObject(packet.getLabel.type, cmdReq, ctx._client.source);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateLabel.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data.label);
				},
				sqnNumber
			);
		});
	}

	public setLabel(label: Label, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (Buffer.byteLength(label.label, 'utf8') > 32) {
				return reject(
					new ServiceErrorBuilder(ER_CLIENT_INVALID_ARGUMENT)
						.withContextualMessage('LIFX client setLabel method expects a maximum of 32 bytes as label')
						.build()
				);
			}

			if (label.label.length < 1) {
				return reject(
					new ServiceErrorBuilder(ER_CLIENT_INVALID_ARGUMENT)
						.withContextualMessage('LIFX client setLabel method expects a minimum of one char as label')
						.build()
				);
			}

			const packetObj = createObject(packet.setLabel.type, label, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateLabel.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					} else {
						clearTimeout(timeoutHandle);

						resolve(data.label);
					}
				},
				sqnNumber
			);
		});
	}

	public getGroup(cache = false, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT): Promise<Group> {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx.connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (cache === true) {
				if (ctx._group) {
					return resolve(ctx._group);
				}
			}

			const cmdReq = { target: this.id };
			const packetObj = createObject(packet.getGroup.type, cmdReq, ctx._client.source);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateGroup.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve({
						group: data.group,
						label: data.label,
						updatedAt: data.updatedAt
					});
				},
				sqnNumber
			);
		});
	}

	public getTags(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (!ctx.legacy) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_CMD_NOT_SUPPORTED).build());
			}

			const cmdReq: LabelRequest = { target: ctx.id };
			const packetObj = createObject(packet.getTags.type, cmdReq, ctx._client.source);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTags.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					} else {
						clearTimeout(timeoutHandle);

						resolve(data.tags);
					}
				},
				sqnNumber
			);
		});
	}

	public setTags(tags: Tag, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (!ctx.legacy) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_CMD_NOT_SUPPORTED).build());
			}

			const packetObj = createObject(packet.setTags.type, tags, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTags.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					} else {
						clearTimeout(timeoutHandle);

						return resolve(data.tags);
					}
				},
				sqnNumber
			);
		});
	}

	public getTagLabels(tagLabels: TagLabels, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (!ctx.legacy) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_CMD_NOT_SUPPORTED).build());
			}

			const packetObj = createObject(packet.getTagLabels.type, tagLabels, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTagLabels.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					resolve(data.label);
				},
				sqnNumber
			);
		});
	}

	public setTagLabels(tagLabels: TagLabels, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (!ctx.legacy) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_CMD_NOT_SUPPORTED).build());
			}

			const packetObj = createObject(packet.setTagLabels.type, tagLabels, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTagLabels.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data.label);
				},
				sqnNumber
			);
		});
	}

	public getAmbientLight(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getAmbientLight.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateAmbientLight.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data.flux);
				},
				sqnNumber
			);
		});
	}

	public getPower(cache = false, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			if (cache) {
				return resolve(ctx._power);
			}

			if (ctx.legacy) {
				const packetObj = createObject(packet.getPowerLegacy.type, {}, ctx._client.source, ctx.id);

				this._client.send(packetObj);

				return resolve(ctx._power);
			}

			const packetObj = createObject(packet.getPower.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.statePower.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					if (data.power === HSBK_MAXIMUM_RAW) {
						ctx._power = true;

						return resolve(true);
					}
					ctx._power = false;

					return resolve(false);
				},
				sqnNumber
			);
		});
	}

	public getColorZones(startIndex: number, endIndex: number) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			validateColorZoneIndex(startIndex);
			validateColorZoneIndexOptional(endIndex);

			if (ctx.legacy) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_CMD_NOT_SUPPORTED).build());
			}

			const cmdReq: ColorZonesRequest = { startIndex, endIndex };
			const packetObj = createObject(packet.getColorZone.type, cmdReq, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);

			if (!endIndex || startIndex === endIndex) {
				ctx._client.addMessageHandler(
					packet.stateZone.name,
					(err: Error, data) => {
						if (err) {
							return reject(err);
						}

						const hsbk = packetToNormalisedHSBK(data.color);

						data.color.hue = hsbk.hue;
						data.color.saturation = hsbk.saturation;
						data.color.brightness = hsbk.brightness;

						return resolve(data);
					},
					sqnNumber
				);
			} else {
				ctx._client.addMessageHandler(
					packet.stateMultiZone.name,
					(error: Error, data) => {
						if (error) {
							return reject(error);
						}
						/** Convert HSB values to readable format */
						data.color.forEach(function (color: ColorHSBK) {
							const hsbk = packetToNormalisedHSBK(data.color);

							color.hue = hsbk.hue;
							color.saturation = hsbk.saturation;
							color.brightness = hsbk.brightness;
						});

						return resolve(data.color);
					},
					sqnNumber
				);
			}
		});
	}

	public setColorZones(
		startIndex: number,
		endIndex: number,
		hue: number,
		saturation: number,
		brightness: number,
		kelvin: number,
		duration: number,
		apply: boolean
	) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			validateColorZoneIndex(startIndex);
			validateColorZoneIndex(endIndex);
			validateNormalisedColorHSBK(hue, saturation, brightness, kelvin);

			const hsbk: ColorHSBK = {
				hue,
				saturation,
				brightness,
				kelvin
			};

			const PacketColor = normalisedToPacketHBSK(hsbk);
			const appReq = apply === false ? ApplyRequest.NO_APPLY : ApplyRequest.APPLY;

			const cmdReq: ColorZonesRequest = {
				startIndex: startIndex,
				endIndex: endIndex,
				color: {
					hue: PacketColor.hue,
					saturation: PacketColor.saturation,
					brightness: PacketColor.brightness,
					kelvin: PacketColor.kelvin
				},
				duration: duration,
				apply: appReq
			};

			const packetObj = createObject(packet.setColorZone.type, cmdReq, ctx._client.source, ctx.id);

			ctx._client.send(packetObj, (err: Error) => {
				if (err) {
					return reject(err);
				}

				return resolve(undefined);
			});
		});
	}

	public setWaveform(waveform: WaveformRequest) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			let packetObj;

			if (waveform.setHue || waveform.setSaturation || waveform.setBrightness || waveform.setKelvin) {
				packetObj = createObject(packet.setWaveformOptional.type, waveform, ctx._client.source, ctx.id);
			} else {
				packetObj = createObject(packet.setWaveform.type, waveform, ctx._client.source, ctx.id);
			}

			ctx._client.send(packetObj, (err: Error) => {
				if (err) {
					return reject(err);
				}

				return resolve(undefined);
			});
		});
	}

	public getDeviceChain(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getDeviceChain.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateDeviceChain.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public getTileState64(timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(packet.getTileState64.type, {}, ctx._client.source, ctx.id);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTileState64.name,
				(err: Error, data: StateDeviceChainResponse) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public setTileState64(setTileState64Request: SetTileState64Request, timeout: number = DEFAULT_MSG_REPLY_TIMEOUT) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(
				packet.setTileState64.type,
				setTileState64Request,
				ctx._client.source,
				ctx.id
			);
			const sqnNumber = ctx._client.send(packetObj);
			const timeoutHandle = setTimeout(() => {
				reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
			}, timeout);

			ctx._client.addMessageHandler(
				packet.stateTileState64.name,
				(err: Error, data) => {
					if (err) {
						return reject(err);
					}

					clearTimeout(timeoutHandle);

					return resolve(data);
				},
				sqnNumber
			);
		});
	}

	public setUserPosition(setUserPositionRequest: SetUserPositionRequest) {
		const ctx = this;

		return new Promise((resolve, reject) => {
			if (!ctx._connectivity) {
				return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
			}

			const packetObj = createObject(
				packet.setUserPosition.type,
				setUserPositionRequest,
				ctx._client.source,
				ctx.id
			);

			ctx._client.send(packetObj, (err: Error) => {
				if (err) {
					return reject(err);
				}

				return resolve(undefined);
			});
		});
	}
}
