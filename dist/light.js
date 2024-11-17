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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUdOLDJCQUEyQixFQUMzQixzQkFBc0IsRUFDdEIsc0JBQXNCLEVBQ3RCLG1CQUFtQixFQUNuQixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFDTixZQUFZLEVBRVosc0JBQXNCLEVBQ3RCLDhCQUE4QixFQUM5QixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBZ0IsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRixPQUFPLEVBR04sK0JBQStCLEVBQy9CLHlCQUF5QixFQUN6QiwwQkFBMEIsRUFDMUIsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHM0MsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHM0UsT0FBTyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUU3RCxPQUFPLEVBQVUseUJBQXlCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUNOLGdCQUFnQixFQUNoQiwwQkFBMEIsRUFDMUIsb0JBQW9CLEVBQ3BCLHNCQUFzQixFQUN0QixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBR25FLE9BQU8sWUFBWSxNQUFNLFFBQVEsQ0FBQztBQUVsQyxN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