import { ColorInfrared, ColorInfraredRequest } from './colorInfrared';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 2;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const brightness = buf.readUInt16LE(offset);

	offset += 2;

	const obj: ColorInfrared = {
		brightness
	};

	return obj;
}

function toBuffer(obj: ColorInfraredRequest) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt16LE(obj.brightness, offset);
	offset += 2;

	return buf;
}

export const stateInfrared: PacketBodyHandler = {
	type: 121,
	name: 'stateInfrared',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
