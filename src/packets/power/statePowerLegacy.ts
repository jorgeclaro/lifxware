import { PowerResponse } from './power';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 2;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const power = buf.readUInt16LE(offset);

	offset += 2;

	const obj: PowerResponse = {
		power
	};

	return obj;
}

function toBuffer(obj: PowerResponse) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt16LE(obj.power, offset);
	offset += 2;

	return buf;
}

export const statePowerLegacy: PacketBodyHandler = {
	type: 22,
	name: 'statePowerLegacy',
	legacy: true,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
