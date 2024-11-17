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
 * Definition of packet header object
 */
export interface PacketHeader {
	/** Frame */

	/** Size of entire message in bytes including this field
	 * @bitSize 16
	 * @zeroIndexedLocation Lower octet: Byte 0. Upper octet: Byte 1.
	 * @type uint16_t
	 */
	size: number;

	/** Protocol number (1024)
	 * @bitSize 12
	 * @zeroIndexedLocation Lower octet: Byte 2. Upper 4 bits: Byte 3, Bits 0-3.
	 * @type uint16_t
	 */
	protocolVersion: number;

	/** Message includes a target address: must be one (1)
	 * @bitSize 1
	 * @zeroIndexedLocation Byte 3, Bit 4.
	 * @type bool
	 */
	addressable: boolean;

	/** Determines usage of the Frame Address target field
	 * @bitSize 1
	 * @zeroIndexedLocation Byte 3, Bit 5.
	 * @type bool
	 * @description The tagged field is a boolean flag that indicates whether
	 * the Frame Address target field is being used to address an individual device or all devices.
	 * For discovery using Device::GetService the tagged field should be set to one (1) and the target should be all zeroes.
	 * In all other messages the tagged field should be set to zero (0) and the target field should contain the device MAC address.
	 * The device will then respond with a Device::StateService message, which will include its own MAC address in the target field.
	 * In all subsequent messages that the client sends to the device,
	 * the target field should be set to the device MAC address, and the tagged field should be set to zero (0).
	 */
	tagged: boolean;

	/** Message origin indicator: must be zero (0)
	 * @bitSize 2
	 * @zeroIndexedLocation Byte 3, Bits 6-7.
	 * @type uint8_t
	 */
	origin: boolean;

	/** Source identifier: unique value set by the client, used by responses
	 * @bitSize 32
	 * @zeroIndexedLocation Lowest octet: Byte 4. Highest octet: Byte 7.
	 * @type uint32_t
	 * @description The source identifier allows each client to provide an unique value,
	 * which will be included by the LIFX device in any message that is sent in response to a message sent by the client.
	 * If the source identifier is a non-zero value, then the LIFX device will send a unicast message to the IP address
	 * and port of the client that sent the originating message. If the source identifier is a zero value,
	 * then the LIFX device may send a broadcast message that can be received by all clients on the same sub-net.
	 * See _ack_required_ and _res_required_ fields in the Frame Address.
	 */
	source: string;

	/** Frame Address */

	/** 6 byte device address (MAC address) or zero (0) means all devices. The last two bytes should be 0 bytes
	 * @bitSize 64
	 * @zeroIndexedLocation Bytes 8 - 15.
	 * @type uint8_t[8]
	 * @description The target device address is 8 bytes long,
	 * when using the 6 byte MAC address then left-justify the value and zero-fill the last two bytes.
	 * A target device address of all zeroes effectively addresses all devices on the local network.
	 * The Frame tagged field must be set accordingly.
	 */
	target: string;

	/** legacy field used for targgeting the master bulb (MAC address) (reserved)
	 * @bitSize 48
	 * @zeroIndexedLocation Bytes 16 - 21.
	 * @type uint8_t[6]
	 */
	site?: string;

	/** Reserved - Must all be zero (0)
	 * @bitSize 48
	 * @zeroIndexedLocation Bytes 16 - 21.
	 * @type uint8_t[6]
	 */

	/** Response message required
	 * @bitSize 1
	 * @zeroIndexedLocation Byte 22, Bit 0.
	 * @type bool
	 * @description _ack_required_ set to one (1) will cause the device to send an Device::Acknowledgement message
	 * The source identifier in the response message will be set to the same value as that in the requesting message sent by the client.
	 * The client can use acknowledgments to determine that the LIFX device has received a message.
	 * However, when using acknowledgments to ensure reliability in an over-burdened lossy network ...
	 * causing additional network packets may make the problem worse.
	 * Client that don't need to track the updated state of a LIFX device can choose not to request a response,
	 * which will reduce the network burden and may provide some performance advantage.
	 * In some cases, a device may choose to send a state update response independent of whether _res_required_ is set.
	 */
	resRequired: boolean;

	/** Acknowledgement message required
	 * @bitSize 1
	 * @zeroIndexedLocation Byte 22, Bit 1.
	 * @type bool
	 * @description _res_required_ set to one (1) within a Set message,
	 * e.g Light::SetPower will cause the device to send the corresponding State message, e.g Light::StatePower
	 * The source identifier in the response message will be set to the same value as that in the requesting message sent by the client.
	 */
	ackRequired: boolean;

	/** Reserved
	 * @bitSize 6
	 * @zeroIndexedLocation Byte 22, Bits 2-7.
	 * @type
	 */

	/** Wrap around message sequence number
	 * @bitSize 8
	 * @zeroIndexedLocation Byte 23.
	 * @type uint8_t
	 * @description The sequence number allows the client to provide a unique value,
	 * which will be included by the LIFX device in any message that is sent in response to a message sent by the client.
	 * This allows the client to distinguish between different messages sent with the same source identifier in the Frame.
	 * See _ack_required_ and _res_required_ fields in the Frame Address.
	 */
	sequence: number;

	/** Protocol Header */

	/** Variable length (body)
	 * @bitSize 64
	 * @zeroIndexedLocation Lowest octet: Byte 24. Highest octet: Byte 31.
	 * @type uint64_t
	 */

	/** Message type determines the payload being used
	 * @bitSize 16
	 * @zeroIndexedLocation Lower octet: Byte 32. Upper octet: Byte 33.
	 * @type uint16_t
	 */
	type: number;

	/** Reserved
	 * @bitSize 16
	 * @zeroIndexedLocation Bytes 34 - 35.
	 * @type
	 */
}

/**
 * Packet types used by internal sending process
 */
export enum PACKET_TRANSACTION_TYPES {
	ONE_WAY = 0,
	REQUEST_RESPONSE = 1
}

/**
 * Definition of packet handler object
 */
export interface PacketBodyHandler {
	type: number;
	name: string;
	legacy: boolean;
	size: number;
	tagged: boolean;
	toObject?: Function;
	toBuffer?: Function;
}

/**
 * Parses a header buffer object into a Header object
 */
export function headerToObject(buf: Buffer): PacketHeader {
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
export function headerToBuffer(obj: PacketHeader): Buffer {
	const buf = Buffer.alloc(PACKET_HEADER_SIZE);

	buf.fill(0);
	let offset = 0;

	/** Frame */
	buf.writeUInt16LE(obj.size, offset);
	offset += 2;

	if (!obj.protocolVersion) {
		if (
			obj.type === packet.setPowerLegacy.type ||
			obj.type === packet.getPowerLegacy.type ||
			obj.type === packet.statePowerLegacy.type
		) {
			obj.protocolVersion = PROTOCOL_VERSION_LEGACY;
		} else {
			obj.protocolVersion = PROTOCOL_VERSION_CURRENT;
		}
	}
	let frameDescription = obj.protocolVersion;

	if (obj.addressable && obj.addressable === true) {
		frameDescription |= ADDRESSABLE_BIT;
	} else if (obj.source && obj.source.length > 0 && obj.source !== PACKET_DEFAULT_SORUCE) {
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
		} else {
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
export function bufferToObject(buf: Buffer) {
	try {
		const header = headerToObject(buf);
		const packetBodyHandler = getPacketBodyHandlerByType(header.type);

		if (packetBodyHandler.toObject) {
			const specificObj = packetBodyHandler.toObject(buf.slice(PACKET_HEADER_SIZE));

			return extend(header, specificObj);
		}

		return header;
	} catch (err: any) {
		err.message = `Could not convert buffer to object. Error: ${err.message}`;
		throw err;
	}
}

/**
 * Serializes a packet object into a packet buffer
 */
export function objectToBuffer(obj: any): Buffer {
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
export function createObject(type: number, params, source?: string, target?: string) {
	const packetHandler = getPacketBodyHandlerByType(type);

	const obj: any = {};

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

export function getPacketBodyHandlerByType(type: number): PacketBodyHandler {
	for (const packetName in packet) {
		if (packet[packetName].type === type) {
			return packet[packetName];
		}
	}

	throw new ServiceErrorBuilder(ER_PACKET_UNKNOWN).withContextualMessage(`Type: ${type}`).build();
}

export function getPacketBodyHandlerByName(name: string): PacketBodyHandler {
	for (const packetName in packet) {
		if (packet[packetName].name === name) {
			return packet[packetName];
		}
	}

	throw new ServiceErrorBuilder(ER_PACKET_UNKNOWN).withContextualMessage(`Name: ${name}`).build();
}
