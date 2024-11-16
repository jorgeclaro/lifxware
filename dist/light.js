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
exports.Light = exports.LightEvents = void 0;
const assert = require("assert");
const eventemitter3_1 = require("eventemitter3");
const colorHSBK_1 = require("./packets/color/colorHSBK");
const colorZone_1 = require("./packets/colorZone/colorZone");
const colorHSBK_2 = require("./packets/color/colorHSBK");
const power_1 = require("./packets/power/power");
const colorInfrared_1 = require("./packets/infrared/colorInfrared");
const packets_1 = require("./packets/packets");
const colorRGBW_1 = require("./packets/colorRGBW/colorRGBW");
const color_1 = require("./lib/color");
const client_1 = require("./client");
const error_1 = require("./lib/error");
const packet_1 = require("./lib/packet");
const lightErrors_1 = require("./errors/lightErrors");
const clientErrors_1 = require("./errors/clientErrors");
var LightEvents;
(function (LightEvents) {
    LightEvents["CONECTIVITY"] = "connectivity";
    LightEvents["LABEL"] = "label";
    LightEvents["COLOR"] = "color";
    LightEvents["STATE"] = "state";
    LightEvents["POWER"] = "power";
})(LightEvents = exports.LightEvents || (exports.LightEvents = {}));
class Light extends eventemitter3_1.EventEmitter {
    constructor(params) {
        super();
        this.id = params.id;
        this.address = params.address;
        this.port = params.port;
        this.legacy = params.legacy;
        this._client = params.client;
        this._power = true;
        this._connectivity = true;
        this._label = '';
        this._color = {
            hue: 0,
            saturation: 0,
            brightness: 0,
            kelvin: 0
        };
        this._discoveryPacketNumber = params.discoveryPacketNumber;
    }
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
    get label() {
        return this._label;
    }
    set label(newLabel) {
        try {
            assert.equal(this._label, newLabel);
        }
        catch (e) {
            this._label = newLabel;
            this.emit(LightEvents.LABEL, this._label);
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
    setPower(power, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = this;
            return new Promise(function (resolve, reject) {
                if (!ctx._connectivity) {
                    return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
                }
                const cmdReq = { power: power ? power_1.POWER_MAXIMUM_RAW : power_1.POWER_MINIMUM_RAW, duration };
                const packetObj = (0, packet_1.createObject)(ctx.legacy ? packets_1.packet.setPowerLegacy.type : packets_1.packet.setPower.type, cmdReq, ctx._client.source, ctx.id);
                ctx._client.send(packetObj, (err, msg, rInfo) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(msg);
                    }
                });
            });
        });
    }
    getColor(cache, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (cache === true) {
                return resolve(ctx._color);
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getLight.type, {}, ctx._client.source, ctx.id);
            if (ctx.legacy) {
                ctx._client.send(packetObj);
                if (!ctx._color) {
                    return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_MISSING_CACHE).build());
                }
                return resolve(ctx._color);
            }
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateLight.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve((0, colorHSBK_1.packetToNormalisedHSBK)(data.color));
            }, sqnNumber);
        });
    }
    setColor(hue, saturation, brightness, kelvin, duration = 0, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            (0, colorHSBK_1.validateNormalisedColorHSBK)(hue, saturation, brightness, kelvin);
            const normalisedColor = {
                hue,
                saturation,
                brightness,
                kelvin
            };
            const color = (0, colorHSBK_1.normalisedToPacketHBSK)(normalisedColor);
            const cmdReq = { color, duration };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setColor.type, cmdReq, ctx._client.source, ctx.id);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
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
    setColorRgb(red, green, blue, duration = 0, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = this;
            (0, colorRGBW_1.validateNormalisedColorRgb)(red, green, blue);
            const hsbObj = (0, color_1.rgbToHsb)({ red, green, blue });
            return yield ctx.setColor(hsbObj.hue, hsbObj.saturation, hsbObj.brightness, colorHSBK_1.HSBK_DEFAULT_KELVIN, duration, timeout);
        });
    }
    setColorRgbHex(hexString, duration = 0, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = this;
            const rgbObj = (0, color_1.rgbHexStringToObject)(hexString);
            const hsbObj = (0, color_1.rgbToHsb)(rgbObj);
            return yield ctx.setColor(hsbObj.hue, hsbObj.saturation, hsbObj.brightness, colorHSBK_1.HSBK_DEFAULT_KELVIN, duration, timeout);
        });
    }
    getTime(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!this._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getTime.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTime.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    setTime(time, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const cmdReq = { time };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setTime.type, cmdReq, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTime.name, (err, data) => {
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
    getState(cache = false, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (cache === true) {
                return resolve({
                    connectivity: ctx._connectivity,
                    power: ctx._power,
                    color: ctx._color
                });
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getLight.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateLight.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                const PacketColor = (0, colorHSBK_1.packetToNormalisedHSBK)(data.color);
                data.color.hue = PacketColor.hue;
                data.color.saturation = PacketColor.saturation;
                data.color.brightness = PacketColor.brightness;
                ctx._power = data.power === colorHSBK_2.HSBK_MAXIMUM_RAW;
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
    getResetSwitchState(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getResetSwitchState.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateResetSwitch.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(!!data.switch);
            }, sqnNumber);
        });
    }
    getInfrared(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getInfrared.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateInfrared.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                const infraredColor = data;
                const irPacket = (0, colorInfrared_1.packetToNormalisedInfrared)(infraredColor);
                data.brightness = irPacket.brightness;
                return resolve(data);
            }, sqnNumber);
        });
    }
    setInfrared(brightness, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            (0, colorInfrared_1.validateNormalisedColorInfrared)(brightness);
            const infraredColor = {
                brightness
            };
            const cmdReq = {
                brightness: (0, colorInfrared_1.normalisedToPacketInfraed)(infraredColor).brightness
            };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setInfrared.type, cmdReq, ctx._client.source, ctx.id);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.send(packetObj, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                const infraredColor = data;
                const hsbk = (0, colorHSBK_1.packetToNormalisedHSBK)(infraredColor);
                data.brightness = hsbk.brightness;
                return resolve(data);
            });
        });
    }
    getHostInfo(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getHostInfo.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateHostInfo.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    getHostFirmware(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getHostFirmware.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateHostFirmware.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    getHardwareVersion(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getVersion.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateVersion.name, (err, data) => {
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
    getWifiInfo(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getWifiInfo.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateWifiInfo.name, (err, data) => {
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
    getWifiFirmware(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getWifiFirmware.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateWifiFirmware.name, (err, data) => {
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
    getLabel(cache = false, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (cache === true) {
                if (ctx._label.length > 0) {
                    return resolve(ctx._label);
                }
            }
            const cmdReq = { target: ctx.id };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getLabel.type, cmdReq, ctx._client.source);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateLabel.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data.label);
            }, sqnNumber);
        });
    }
    setLabel(label, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (Buffer.byteLength(label.label, 'utf8') > 32) {
                return reject(new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_INVALID_ARGUMENT)
                    .withContextualMessage('LIFX client setLabel method expects a maximum of 32 bytes as label')
                    .build());
            }
            if (label.label.length < 1) {
                return reject(new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_INVALID_ARGUMENT)
                    .withContextualMessage('LIFX client setLabel method expects a minimum of one char as label')
                    .build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setLabel.type, label, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateLabel.name, (err, data) => {
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
    getGroup(cache = false, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx.connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (cache === true) {
                if (ctx._group) {
                    return resolve(ctx._group);
                }
            }
            const cmdReq = { target: this.id };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getGroup.type, cmdReq, ctx._client.source);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateGroup.name, (err, data) => {
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
    getTags(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (!ctx.legacy) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_NOT_SUPPORTED).build());
            }
            const cmdReq = { target: ctx.id };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getTags.type, cmdReq, ctx._client.source);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTags.name, (err, data) => {
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
    setTags(tags, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (!ctx.legacy) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_NOT_SUPPORTED).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setTags.type, tags, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTags.name, (err, data) => {
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
    getTagLabels(tagLabels, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (!ctx.legacy) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_NOT_SUPPORTED).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getTagLabels.type, tagLabels, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTagLabels.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                resolve(data.label);
            }, sqnNumber);
        });
    }
    setTagLabels(tagLabels, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (!ctx.legacy) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_NOT_SUPPORTED).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setTagLabels.type, tagLabels, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTagLabels.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data.label);
            }, sqnNumber);
        });
    }
    getAmbientLight(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getAmbientLight.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateAmbientLight.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data.flux);
            }, sqnNumber);
        });
    }
    getPower(cache = false, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            if (cache) {
                return resolve(ctx._power);
            }
            if (ctx.legacy) {
                const packetObj = (0, packet_1.createObject)(packets_1.packet.getPowerLegacy.type, {}, ctx._client.source, ctx.id);
                this._client.send(packetObj);
                return resolve(ctx._power);
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getPower.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.statePower.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                if (data.power === colorHSBK_2.HSBK_MAXIMUM_RAW) {
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
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            (0, colorZone_1.validateColorZoneIndex)(startIndex);
            (0, colorZone_1.validateColorZoneIndexOptional)(endIndex);
            if (ctx.legacy) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_NOT_SUPPORTED).build());
            }
            const cmdReq = { startIndex, endIndex };
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getColorZone.type, cmdReq, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            if (!endIndex || startIndex === endIndex) {
                ctx._client.addMessageHandler(packets_1.packet.stateZone.name, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const hsbk = (0, colorHSBK_1.packetToNormalisedHSBK)(data.color);
                    data.color.hue = hsbk.hue;
                    data.color.saturation = hsbk.saturation;
                    data.color.brightness = hsbk.brightness;
                    return resolve(data);
                }, sqnNumber);
            }
            else {
                ctx._client.addMessageHandler(packets_1.packet.stateMultiZone.name, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    /** Convert HSB values to readable format */
                    data.color.forEach(function (color) {
                        const hsbk = (0, colorHSBK_1.packetToNormalisedHSBK)(data.color);
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
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            (0, colorZone_1.validateColorZoneIndex)(startIndex);
            (0, colorZone_1.validateColorZoneIndex)(endIndex);
            (0, colorHSBK_1.validateNormalisedColorHSBK)(hue, saturation, brightness, kelvin);
            const hsbk = {
                hue,
                saturation,
                brightness,
                kelvin
            };
            const PacketColor = (0, colorHSBK_1.normalisedToPacketHBSK)(hsbk);
            const appReq = apply === false ? colorZone_1.ApplyRequest.NO_APPLY : colorZone_1.ApplyRequest.APPLY;
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
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setColorZone.type, cmdReq, ctx._client.source, ctx.id);
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
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            let packetObj;
            if (waveform.setHue || waveform.setSaturation || waveform.setBrightness || waveform.setKelvin) {
                packetObj = (0, packet_1.createObject)(packets_1.packet.setWaveformOptional.type, waveform, ctx._client.source, ctx.id);
            }
            else {
                packetObj = (0, packet_1.createObject)(packets_1.packet.setWaveform.type, waveform, ctx._client.source, ctx.id);
            }
            ctx._client.send(packetObj, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(undefined);
            });
        });
    }
    getDeviceChain(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getDeviceChain.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateDeviceChain.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    getTileState64(timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.getTileState64.type, {}, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTileState64.name, (err, data) => {
                if (err) {
                    return reject(err);
                }
                clearTimeout(timeoutHandle);
                return resolve(data);
            }, sqnNumber);
        });
    }
    setTileState64(setTileState64Request, timeout = client_1.DEFAULT_MSG_REPLY_TIMEOUT) {
        const ctx = this;
        return new Promise((resolve, reject) => {
            if (!ctx._connectivity) {
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setTileState64.type, setTileState64Request, ctx._client.source, ctx.id);
            const sqnNumber = ctx._client.send(packetObj);
            const timeoutHandle = setTimeout(() => {
                reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_CMD_TIMEOUT).withContextualMessage(`Id: ${ctx.id}`).build());
            }, timeout);
            ctx._client.addMessageHandler(packets_1.packet.stateTileState64.name, (err, data) => {
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
                return reject(new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_OFFLINE).withContextualMessage(`Id: ${ctx.id}`).build());
            }
            const packetObj = (0, packet_1.createObject)(packets_1.packet.setUserPosition.type, setUserPositionRequest, ctx._client.source, ctx.id);
            ctx._client.send(packetObj, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve(undefined);
            });
        });
    }
}
exports.Light = Light;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsaUNBQWlDO0FBQ2pDLGlEQUE2QztBQUM3Qyx5REFPbUM7QUFDbkMsNkRBS3VDO0FBQ3ZDLHlEQUE2RDtBQUM3RCxpREFBMkY7QUFDM0Ysb0VBTTBDO0FBQzFDLCtDQUEyQztBQUczQyw2REFBMkU7QUFHM0UsdUNBQTZEO0FBRTdELHFDQUE2RDtBQUU3RCx1Q0FBa0Q7QUFDbEQseUNBQTRDO0FBQzVDLHNEQUs4QjtBQUM5Qix3REFBbUU7QUFJbkUsSUFBWSxXQU1YO0FBTkQsV0FBWSxXQUFXO0lBQ3RCLDJDQUE0QixDQUFBO0lBQzVCLDhCQUFlLENBQUE7SUFDZiw4QkFBZSxDQUFBO0lBQ2YsOEJBQWUsQ0FBQTtJQUNmLDhCQUFlLENBQUE7QUFDaEIsQ0FBQyxFQU5XLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBTXRCO0FBV0QsTUFBYSxLQUFNLFNBQVEsNEJBQVk7SUEyRnRDLFlBQW1CLE1BQW9CO1FBQ3RDLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHO1lB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