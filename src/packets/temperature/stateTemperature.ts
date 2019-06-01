import { Temperature } from './temperature';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 2;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const temperature = buf.readUInt16LE(offset);

	offset += 2;

	const obj: Temperature = {
		temperature
	};

	return obj;
}

function toBuffer(obj: Temperature) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt16LE(obj.temperature, offset);
	offset += 2;

	return buf;
}

export const stateTemperature: PacketBodyHandler = {
	type: 111,
	name: 'stateTemperature',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
