"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPacketBodyHandlerByName = exports.getPacketBodyHandlerByType = exports.createObject = exports.objectToBuffer = exports.bufferToObject = exports.headerToBuffer = exports.headerToObject = exports.PACKET_TRANSACTION_TYPES = exports.PACKET_DEFAULT_SORUCE = exports.PACKET_HEADER_SEQUENCE_MAX = exports.PACKET_HEADER_SIZE = exports.PROTOCOL_VERSION_LEGACY = exports.PROTOCOL_VERSION_CURRENT = exports.ACK_REQUIRED_BIT = exports.RESPONSE_REQUIRED_BIT = exports.PROTOCOL_VERSION_BITS = exports.ORIGIN_BITS = exports.TAGGED_BIT = exports.ADDRESSABLE_BIT = void 0;
const _ = require("lodash");
const packets_1 = require("../packets/packets");
const error_1 = require("./error");
const clientErrors_1 = require("../errors/clientErrors");
const packetErrors_1 = require("../errors/packetErrors");
/** Masks for packet description in packet header */
exports.ADDRESSABLE_BIT = 0x1000;
exports.TAGGED_BIT = 0x2000;
exports.ORIGIN_BITS = 0xc000;
exports.PROTOCOL_VERSION_BITS = 0xfff;
/** Masks for response types in packet header */
exports.RESPONSE_REQUIRED_BIT = 0x1;
exports.ACK_REQUIRED_BIT = 0x2;
/** Protocol version mappings */
exports.PROTOCOL_VERSION_CURRENT = 1024;
exports.PROTOCOL_VERSION_LEGACY = 13312;
/** Packet headers */
exports.PACKET_HEADER_SIZE = 36;
exports.PACKET_HEADER_SEQUENCE_MAX = 255;
exports.PACKET_DEFAULT_SORUCE = '00000000';
/**
 * Packet types used by internal sending process
 */
var PACKET_TRANSACTION_TYPES;
(function (PACKET_TRANSACTION_TYPES) {
    PACKET_TRANSACTION_TYPES[PACKET_TRANSACTION_TYPES["ONE_WAY"] = 0] = "ONE_WAY";
    PACKET_TRANSACTION_TYPES[PACKET_TRANSACTION_TYPES["REQUEST_RESPONSE"] = 1] = "REQUEST_RESPONSE";
})(PACKET_TRANSACTION_TYPES = exports.PACKET_TRANSACTION_TYPES || (exports.PACKET_TRANSACTION_TYPES = {}));
/**
 * Parses a header buffer object into a Header object
 */
function headerToObject(buf) {
    let offset = 0;
    /** Frame */
    const size = buf.readUInt16LE(offset);
    offset += 2;
    const frameDescription = buf.readUInt16LE(offset);
    const addressable = (frameDescription & exports.ADDRESSABLE_BIT) !== 0;
    const tagged = (frameDescription & exports.TAGGED_BIT) !== 0;
    const origin = (frameDescription & exports.ORIGIN_BITS) >> 14 !== 0;
    const protocolVersion = frameDescription & exports.PROTOCOL_VERSION_BITS;
    offset += 2;
    const source = buf.toString('hex', offset, offset + 4);
    offset += 4;
    /** Frame Address */
    const target = buf.toString('hex', offset, offset + 6);
    offset += 8;
    let site = buf.toString('utf8', offset, offset + 6);
    site = site.replace(/\0/g, '');
    offset += 6;
    const frameAddressDescription = buf.readUInt8(offset);
    const ackRequired = (frameAddressDescription & exports.ACK_REQUIRED_BIT) !== 0;
    const resRequired = (frameAddressDescription & exports.RESPONSE_REQUIRED_BIT) !== 0;
    offset += 1;
    const sequence = buf.readUInt8(offset);
    offset += 1;
    /** Protocol Header */
    offset += 8;
    const type = buf.readUInt16LE(offset);
    offset += 4;
    return {
        size,
        addressable,
        tagged,
        origin,
        protocolVersion,
        source,
        target,
        site,
        ackRequired,
        resRequired,
        sequence,
        type
    };
}
exports.headerToObject = headerToObject;
/**
 * Serializes a header object into a Header buffer
 */
//eslint-disable-next-line complexity
function headerToBuffer(obj) {
    const buf = Buffer.alloc(exports.PACKET_HEADER_SIZE);
    buf.fill(0);
    let offset = 0;
    /** Frame */
    buf.writeUInt16LE(obj.size, offset);
    offset += 2;
    if (!obj.protocolVersion) {
        if (obj.type === packets_1.packet.setPowerLegacy.type ||
            obj.type === packets_1.packet.getPowerLegacy.type ||
            obj.type === packets_1.packet.statePowerLegacy.type) {
            obj.protocolVersion = exports.PROTOCOL_VERSION_LEGACY;
        }
        else {
            obj.protocolVersion = exports.PROTOCOL_VERSION_CURRENT;
        }
    }
    let frameDescription = obj.protocolVersion;
    if (obj.addressable && obj.addressable === true) {
        frameDescription |= exports.ADDRESSABLE_BIT;
    }
    else if (obj.source && obj.source.length > 0 && obj.source !== exports.PACKET_DEFAULT_SORUCE) {
        frameDescription |= exports.ADDRESSABLE_BIT;
    }
    if (obj.tagged && obj.tagged === true) {
        frameDescription |= exports.TAGGED_BIT;
    }
    if (obj.origin && obj.origin === true) {
        frameDescription |= 1 << 14;
    }
    buf.writeUInt16LE(frameDescription, offset);
    offset += 2;
    if (obj.source && obj.source.length > 0) {
        if (obj.source.length === 8) {
            buf.write(obj.source, offset, 4, 'hex');
        }
        else {
            throw new error_1.ServiceErrorBuilder(clientErrors_1.ER_CLIENT_MESSAGE_PROCESS)
                .withContextualMessage('Light source must be given in 8 characters')
                .build();
        }
    }
    offset += 4;
    /** Frame Address */
    if (obj.target) {
        buf.write(obj.target, offset, 6, 'hex');
    }
    offset += 8;
    if (obj.site) {
        buf.write(obj.site, offset, 6, 'hex');
    }
    offset += 6;
    let frameAddressDescription = 0;
    if (obj.ackRequired && obj.ackRequired === true) {
        frameAddressDescription |= exports.ACK_REQUIRED_BIT;
    }
    if (obj.resRequired && obj.resRequired === true) {
        frameAddressDescription |= exports.RESPONSE_REQUIRED_BIT;
    }
    buf.writeUInt8(frameAddressDescription, offset);
    offset += 1;
    buf.writeUInt8(obj.sequence, offset);
    offset += 1;
    /** Protocol Header */
    offset += 8;
    buf.writeUInt16LE(obj.type, offset);
    return buf;
}
exports.headerToBuffer = headerToBuffer;
/**
 * Parses a packet buffer into a packet object
 */
function bufferToObject(buf) {
    try {
        const header = headerToObject(buf);
        const packetBodyHandler = getPacketBodyHandlerByType(header.type);
        if (packetBodyHandler.toObject) {
            const specificObj = packetBodyHandler.toObject(buf.slice(exports.PACKET_HEADER_SIZE));
            return _.extend(header, specificObj);
        }
        return header;
    }
    catch (err) {
        err.message = `Could not convert buffer to object. Error: ${err.message}`;
        throw err;
    }
}
exports.bufferToObject = bufferToObject;
/**
 * Serializes a packet object into a packet buffer
 */
function objectToBuffer(obj) {
    const packetHandler = getPacketBodyHandlerByType(obj.type);
    if (packetHandler.toBuffer) {
        const packetTypeData = packets_1.packet[packetHandler.name].toBuffer(obj);
        return Buffer.concat([headerToBuffer(obj), packetTypeData]);
    }
    return headerToBuffer(obj);
}
exports.objectToBuffer = objectToBuffer;
/**
 * Creates a packet object
 */
function createObject(type, params, source, target) {
    const packetHandler = getPacketBodyHandlerByType(type);
    const obj = {};
    obj.type = type;
    obj.size = exports.PACKET_HEADER_SIZE + packetHandler.size;
    if (source) {
        obj.source = source;
    }
    if (target) {
        obj.target = target;
    }
    obj.tagged = packetHandler.tagged;
    return _.assign(obj, params);
}
exports.createObject = createObject;
function getPacketBodyHandlerByType(type) {
    for (const packetName in packets_1.packet) {
        if (packets_1.packet[packetName].type === type) {
            return packets_1.packet[packetName];
        }
    }
    throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_UNKNOWN).withContextualMessage(`Type: ${type}`).build();
}
exports.getPacketBodyHandlerByType = getPacketBodyHandlerByType;
function getPacketBodyHandlerByName(name) {
    for (const packetName in packets_1.packet) {
        if (packets_1.packet[packetName].name === name) {
            return packets_1.packet[packetName];
        }
    }
    throw new error_1.ServiceErrorBuilder(packetErrors_1.ER_PACKET_UNKNOWN).withContextualMessage(`Name: ${name}`).build();
}
exports.getPacketBodyHandlerByName = getPacketBodyHandlerByName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9wYWNrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLGdEQUE0QztBQUM1QyxtQ0FBOEM7QUFDOUMseURBQW1FO0FBQ25FLHlEQUEyRDtBQUUzRCxvREFBb0Q7QUFDdkMsUUFBQSxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLFFBQUEsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixRQUFBLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBQSxxQkFBcUIsR0FBRyxLQUFLLENBQUM7QUFFM0MsZ0RBQWdEO0FBQ25DLFFBQUEscUJBQXFCLEdBQUcsR0FBRyxDQUFDO0FBQzVCLFFBQUEsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0FBRXBDLGdDQUFnQztBQUNuQixRQUFBLHdCQUF3QixHQUFHLElBQUksQ0FBQztBQUNoQyxRQUFBLHVCQUF1QixHQUFHLEtBQUssQ0FBQztBQUU3QyxxQkFBcUI7QUFDUixRQUFBLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUN4QixRQUFBLDBCQUEwQixHQUFHLEdBQUcsQ0FBQztBQUNqQyxRQUFBLHFCQUFxQixHQUFHLFVBQVUsQ0FBQztBQXlKaEQ7O0dBRUc7QUFDSCxJQUFZLHdCQUdYO0FBSEQsV0FBWSx3QkFBd0I7SUFDbkMsNkVBQVcsQ0FBQTtJQUNYLCtGQUFvQixDQUFBO0FBQ3JCLENBQUMsRUFIVyx3QkFBd0IsR0FBeEIsZ0NBQXdCLEtBQXhCLGdDQUF3QixRQUduQztBQWVEOztHQUVHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLEdBQVc7SUFDekMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRWYsWUFBWTtJQUNaLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUVaLE1BQU0sZ0JBQWdCLEdBQUcs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