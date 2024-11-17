import * as assert from 'assert';
import { validateNormalisedColorHSBK, packetToNormalisedHSBK, normalisedToPacketHBSK, HSBK_DEFAULT_KELVIN } from './packets/color/colorHSBK';
import { ApplyRequest, validateColorZoneIndex, validateColorZoneIndexOptional } from './packets/colorZone/colorZone';
import { HSBK_MAXIMUM_RAW } from './packets/color/colorHSBK';
import { POWER_MINIMUM_RAW, POWER_MAXIMUM_RAW } from './packets/power/power';
import { validateNormalisedColorInfrared, normalisedToPacketInfraed, packetToNormalisedInfrared } from './packets/infrared/colorInfrared';
import { packet } from './packets/packets';
import { validateNormalisedColorRgb } from './packets/colorRGBW/colorRGBW';
import { rgbToHsb, rgbHexStringToObject } from './lib/color';
import { DEFAULT_MSG_REPLY_TIMEOUT } from './client';
import { ServiceErrorBuilder } from './lib/error';
import { createObject } from './lib/packet';
import { ER_LIGHT_OFFLINE, ER_LIGHT_CMD_NOT_SUPPORTED, ER_LIGHT_CMD_TIMEOUT, ER_LIGHT_MISSING_CACHE } from './errors/lightErrors';
import { ER_CLIENT_INVALID_ARGUMENT } from './errors/clientErrors';
import EventEmitter from 'events';
export var LightEvents;
(function (LightEvents) {
    LightEvents["CONECTIVITY"] = "connectivity";
    LightEvents["LABEL"] = "label";
    LightEvents["COLOR"] = "color";
    LightEvents["STATE"] = "state";
    LightEvents["POWER"] = "power";
})(LightEvents || (LightEvents = {}));
export class Light extends EventEmitter {
    id;
    address;
    port;
    legacy;
    label;
    _discoveryPacketNumber;
    _client;
    _connectivity;
    _group;
    _power;
    _color;
    get connectivity() {
        return this._connectivity;
    }
    set connectivity(newConnectivity) {
        try {
            assert.equal(this._connectivity, newConnectivity);
        }
        catch (e) {
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
    set power(newPower) {
        try {
            assert.equal(this._power, newPower);
        }
        catch (e) {
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
    set color(newColor) {
        try {
            assert.equal(this._color.hue, newColor.hue);
            assert.equal(this._color.saturation, newColor.saturation);
            assert.equal(this._color.brightness, newColor.brightness);
            assert.equal(this._color.kelvin, newColor.kelvin);
        }
        catch (e) {
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
    set discoveryPacketNumber(discoveryPacketNumber) {
        this._discoveryPacketNumber = discoveryPacketNumber;
    }
    constructor(params) {
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
    async setPower(power, duration) {
        const ctx = this;
        return new Promise(function (resolve, reject) {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const cmdReq = { power: power ? POWER_MAXIMUM_RAW : POWER_MINIMUM_RAW, duration };
            const packetObj = createObject(ctx.legacy ? packet.setPowerLegacy.type : packet.setPower.type, cmdReq, ctx._client.source, ctx.id);
            ctx._client.send(packetObj, (err, msg, rInfo) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(msg);
                }
            });
        });
    }
    getColor(cache, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateLight.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(packetToNormalisedHSBK(data.color));
            }, sqnNumber);
        });
    }
    setColor(hue, saturation, brightness, kelvin, duration = 0, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            validateNormalisedColorHSBK(hue, saturation, brightness, kelvin);
            const normalisedColor = {
                hue,
                saturation,
                brightness,
                kelvin
            };
            const color = normalisedToPacketHBSK(normalisedColor);
            const cmdReq = { color, duration };
            const packetObj = createObject(packet.setColor.type, cmdReq, ctx._client.source, ctx.id);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.send(packetObj, (err, msg, rInfo) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(msg);
            });
        });
    }
    async setColorRgb(red, green, blue, duration = 0, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        validateNormalisedColorRgb(red, green, blue);
        const hsbObj = rgbToHsb({ red, green, blue });
        return await ctx.setColor(hsbObj.hue, hsbObj.saturation, hsbObj.brightness, HSBK_DEFAULT_KELVIN, duration, timeout);
    }
    async setColorRgbHex(hexString, duration = 0, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        const rgbObj = rgbHexStringToObject(hexString);
        const hsbObj = rgbToHsb(rgbObj);
        return await ctx.setColor(hsbObj.hue, hsbObj.saturation, hsbObj.brightness, HSBK_DEFAULT_KELVIN, duration, timeout);
    }
    getTime(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateTime.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    setTime(time, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const cmdReq = { time };
            const packetObj = createObject(packet.setTime.type, cmdReq, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packet.stateTime.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                else {
                    clearTimeout(timeoutHandle);
                    return resolve(data);
                }
            }, sqnNumber);
        });
    }
    getState(cache = false, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateLight.name, (err, data) => {
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
            }, sqnNumber);
        });
    }
    getResetSwitchState(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateResetSwitch.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(!!data.switch);
            }, sqnNumber);
        });
    }
    getInfrared(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateInfrared.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                const infraredColor = data;
                const irPacket = packetToNormalisedInfrared(infraredColor);
                data.brightness = irPacket.brightness;
                return resolve(data);
            }, sqnNumber);
        });
    }
    setInfrared(brightness, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            validateNormalisedColorInfrared(brightness);
            const infraredColor = {
                brightness
            };
            const cmdReq = {
                brightness: normalisedToPacketInfraed(infraredColor).brightness
            };
            const packetObj = createObject(packet.setInfrared.type, cmdReq, ctx._client.source, ctx.id);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.send(packetObj, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                const infraredColor = data;
                const hsbk = packetToNormalisedHSBK(infraredColor);
                data.brightness = hsbk.brightness;
                return resolve(data);
            });
        });
    }
    getHostInfo(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateHostInfo.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    getHostFirmware(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateHostFirmware.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    getHardwareVersion(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateVersion.name, (err, data) => {
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
            }, sqnNumber);
        });
    }
    getWifiInfo(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateWifiInfo.name, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
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
            }, sqnNumber);
        });
    }
    getWifiFirmware(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateWifiFirmware.name, (err, data) => {
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
            }, sqnNumber);
        });
    }
    getLabel(cache = false, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            const cmdReq = { target: ctx.id };
            const packetObj = createObject(packet.getLabel.type, cmdReq, ctx._client.source);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packet.stateLabel.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data.label);
            }, sqnNumber);
        });
    }
    setLabel(label, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (Buffer.byteLength(label.label, 'utf8') > 32) {
                return reject(new ServiceErrorBuilder(ER_CLIENT_INVALID_ARGUMENT)
                    .withContextualMessage('LIFX client setLabel method expects a maximum of 32 bytes as label')
                    .build());
            }
            if (label.label.length < 1) {
                return reject(new ServiceErrorBuilder(ER_CLIENT_INVALID_ARGUMENT)
                    .withContextualMessage('LIFX client setLabel method expects a minimum of one char as label')
                    .build());
            }
            const packetObj = createObject(packet.setLabel.type, label, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packet.stateLabel.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                else {
                    clearTimeout(timeoutHandle);
                    resolve(data.label);
                }
            }, sqnNumber);
        });
    }
    getGroup(cache = false, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateGroup.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve({
                    group: data.group,
                    label: data.label,
                    updatedAt: data.updatedAt
                });
            }, sqnNumber);
        });
    }
    getTags(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (!ctx.legacy) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_CMD_NOT_SUPPORTED).build());
            }
            const cmdReq = { target: ctx.id };
            const packetObj = createObject(packet.getTags.type, cmdReq, ctx._client.source);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packet.stateTags.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                else {
                    clearTimeout(timeoutHandle);
                    resolve(data.tags);
                }
            }, sqnNumber);
        });
    }
    setTags(tags, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateTags.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                else {
                    clearTimeout(timeoutHandle);
                    return resolve(data.tags);
                }
            }, sqnNumber);
        });
    }
    getTagLabels(tagLabels, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateTagLabels.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                resolve(data.label);
            }, sqnNumber);
        });
    }
    setTagLabels(tagLabels, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateTagLabels.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data.label);
            }, sqnNumber);
        });
    }
    getAmbientLight(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateAmbientLight.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data.flux);
            }, sqnNumber);
        });
    }
    getPower(cache = false, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.statePower.name, (err, data) => {
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
            }, sqnNumber);
        });
    }
    getColorZones(startIndex, endIndex) {
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
            const cmdReq = { startIndex, endIndex };
            const packetObj = createObject(packet.getColorZone.type, cmdReq, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            if (!endIndex || startIndex === endIndex) {
                ctx._client.addMessageHandler(packet.stateZone.name, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const hsbk = packetToNormalisedHSBK(data.color);
                    data.color.hue = hsbk.hue;
                    data.color.saturation = hsbk.saturation;
                    data.color.brightness = hsbk.brightness;
                    return resolve(data);
                }, sqnNumber);
            }
            else {
                ctx._client.addMessageHandler(packet.stateMultiZone.name, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    /** Convert HSB values to readable format */
                    data.color.forEach(function (color) {
                        const hsbk = packetToNormalisedHSBK(data.color);
                        color.hue = hsbk.hue;
                        color.saturation = hsbk.saturation;
                        color.brightness = hsbk.brightness;
                    });
                    return resolve(data.color);
                }, sqnNumber);
            }
        });
    }
    setColorZones(startIndex, endIndex, hue, saturation, brightness, kelvin, duration, apply) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            validateColorZoneIndex(startIndex);
            validateColorZoneIndex(endIndex);
            validateNormalisedColorHSBK(hue, saturation, brightness, kelvin);
            const hsbk = {
                hue,
                saturation,
                brightness,
                kelvin
            };
            const PacketColor = normalisedToPacketHBSK(hsbk);
            const appReq = apply === false ? ApplyRequest.NO_APPLY : ApplyRequest.APPLY;
            const cmdReq = {
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
            ctx._client.send(packetObj, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(undefined);
            });
        });
    }
    setWaveform(waveform) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            let packetObj;
            if (waveform.setHue || waveform.setSaturation || waveform.setBrightness || waveform.setKelvin) {
                packetObj = createObject(packet.setWaveformOptional.type, waveform, ctx._client.source, ctx.id);
            }
            else {
                packetObj = createObject(packet.setWaveform.type, waveform, ctx._client.source, ctx.id);
            }
            ctx._client.send(packetObj, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(undefined);
            });
        });
    }
    getDeviceChain(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateDeviceChain.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    getTileState64(timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
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
            ctx._client.addMessageHandler(packet.stateTileState64.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    setTileState64(setTileState64Request, timeout = DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = createObject(packet.setTileState64.type, setTileState64Request, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new ServiceErrorBuilder(ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packet.stateTileState64.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    setUserPosition(setUserPositionRequest) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new ServiceErrorBuilder(ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = createObject(packet.setUserPosition.type, setUserPositionRequest, ctx._client.source, ctx.id);
            ctx._client.send(packetObj, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(undefined);
            });
        });
    }
}
//# sourceMappingURL=light.js.map