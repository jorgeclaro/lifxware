import assign from 'lodash/assign';
import extend from 'lodash/extend';
import { packet } from '../packets/packets';
import { ServiceErrorBuilder } from './error';
import { ER_CLIENT_MESSAGE_PROCESS } from '../errors/clientErrors';
import { ER_PACKET_UNKNOWN } from '../errors/packetErrors';
/** Masks for packet description in packet header */
export const ADDRESSABLE_BIT = 0x1000;
export const TAGGED_BIT = 0x2000;
export const ORIGIN_BITS = 0xc000;
export const PROTOCOL_VERSION_BITS = 0xfff;
/** Masks for response types in packet header */
export const RESPONSE_REQUIRED_BIT = 0x1;
export const ACK_REQUIRED_BIT = 0x2;
/** Protocol version mappings */
export const PROTOCOL_VERSION_CURRENT = 1024;
export const PROTOCOL_VERSION_LEGACY = 13312;
/** Packet headers */
export const PACKET_HEADER_SIZE = 36;
export const PACKET_HEADER_SEQUENCE_MAX = 255;
export const PACKET_DEFAULT_SORUCE = '00000000';
/**
 * Packet types used by internal sending process
 */
export var PACKET_TRANSACTION_TYPES;
(function (PACKET_TRANSACTION_TYPES) {
    PACKET_TRANSACTION_TYPES[PACKET_TRANSACTION_TYPES["ONE_WAY"] = 0] = "ONE_WAY";
    PACKET_TRANSACTION_TYPES[PACKET_TRANSACTION_TYPES["REQUEST_RESPONSE"] = 1] = "REQUEST_RESPONSE";
})(PACKET_TRANSACTION_TYPES || (PACKET_TRANSACTION_TYPES = {}));
/**
 * Parses a header buffer object into a Header object
 */
export function headerToObject(buf) {
    let offset = 0;
    /** Frame */
    const size = buf.readUInt16LE(offset);
    offset += 2;
    const frameDescription = buf.readUInt16LE(offset);
    const addressable = (frameDescription & ADDRESSABLE_BIT) !== 0;
    const tagged = (frameDescription & TAGGED_BIT) !== 0;
    const origin = (frameDescription & ORIGIN_BITS) >> 14 !== 0;
    const protocolVersion = frameDescription & PROTOCOL_VERSION_BITS;
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
    const ackRequired = (frameAddressDescription & ACK_REQUIRED_BIT) !== 0;
    const resRequired = (frameAddressDescription & RESPONSE_REQUIRED_BIT) !== 0;
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
/**
 * Serializes a header object into a Header buffer
 */
//eslint-disable-next-line complexity
export function headerToBuffer(obj) {
    const buf = Buffer.alloc(PACKET_HEADER_SIZE);
    buf.fill(0);
    let offset = 0;
    /** Frame */
    buf.writeUInt16LE(obj.size, offset);
    offset += 2;
    if (!obj.protocolVersion) {
        if (obj.type === packet.setPowerLegacy.type ||
            obj.type === packet.getPowerLegacy.type ||
            obj.type === packet.statePowerLegacy.type) {
            obj.protocolVersion = PROTOCOL_VERSION_LEGACY;
        }
        else {
            obj.protocolVersion = PROTOCOL_VERSION_CURRENT;
        }
    }
    let frameDescription = obj.protocolVersion;
    if (obj.addressable && obj.addressable === true) {
        frameDescription |= ADDRESSABLE_BIT;
    }
    else if (obj.source && obj.source.length > 0 && obj.source !== PACKET_DEFAULT_SORUCE) {
        frameDescription |= ADDRESSABLE_BIT;
    }
    if (obj.tagged && obj.tagged === true) {
        frameDescription |= TAGGED_BIT;
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
            throw new ServiceErrorBuilder(ER_CLIENT_MESSAGE_PROCESS)
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
        frameAddressDescription |= ACK_REQUIRED_BIT;
    }
    if (obj.resRequired && obj.resRequired === true) {
        frameAddressDescription |= RESPONSE_REQUIRED_BIT;
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
/**
 * Parses a packet buffer into a packet object
 */
export function bufferToObject(buf) {
    try {
        const header = headerToObject(buf);
        const packetBodyHandler = getPacketBodyHandlerByType(header.type);
        if (packetBodyHandler.toObject) {
            const specificObj = packetBodyHandler.toObject(buf.slice(PACKET_HEADER_SIZE));
            return extend(header, specificObj);
        }
        return header;
    }
    catch (err) {
        err.message = `Could not convert buffer to object. Error: ${err.message}`;
        throw err;
    }
}
/**
 * Serializes a packet object into a packet buffer
 */
export function objectToBuffer(obj) {
    const packetHandler = getPacketBodyHandlerByType(obj.type);
    if (packetHandler.toBuffer) {
        const packetTypeData = packet[packetHandler.name].toBuffer(obj);
        return Buffer.concat([headerToBuffer(obj), packetTypeData]);
    }
    return headerToBuffer(obj);
}
/**
 * Creates a packet object
 */
export function createObject(type, params, source, target) {
    const packetHandler = getPacketBodyHandlerByType(type);
    const obj = {};
    obj.type = type;
    obj.size = PACKET_HEADER_SIZE + packetHandler.size;
    if (source) {
        obj.source = source;
    }
    if (target) {
        obj.target = target;
    }
    obj.tagged = packetHandler.tagged;
    return assign(obj, params);
}
export function getPacketBodyHandlerByType(type) {
    for (const packetName in packet) {
        if (packet[packetName].type === type) {
            return packet[packetName];
        }
    }
    throw new ServiceErrorBuilder(ER_PACKET_UNKNOWN).withContextualMessage(`Type: ${type}`).build();
}
export function getPacketBodyHandlerByName(name) {
    for (const packetName in packet) {
        if (packet[packetName].name === name) {
            return packet[packetName];
        }
    }
    throw new ServiceErrorBuilder(ER_PACKET_UNKNOWN).withContextualMessage(`Name: ${name}`).build();
}
//# sourceMappingURL=packet.js.map