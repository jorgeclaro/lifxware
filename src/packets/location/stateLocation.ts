import * as utils from '../../lib/utils';
import { Location } from './location';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 56;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const location = buf.toString('hex', offset, offset + 16);

	offset += 16;

	let label = buf.toString('utf8', offset, offset + 32);

	label = label.replace(/\0/g, '');
	offset += 32;

	const updatedAt = new Date(utils.readUInt64LE(buf, offset));

	offset += 8;

	const obj: Location = {
		location,
		label,
		updatedAt
	};

	return obj;
}

function toBuffer(obj: Location) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.write(obj.location, offset, 16, 'hex');
	offset += 16;

	buf.write(obj.label, offset, 32, 'utf8');
	offset += 32;

	utils.writeUInt64LE(buf, offset, obj.updatedAt);
	offset += 8;

	return buf;
}

export const stateLocation: PacketBodyHandler = {
	type: 50,
	name: 'stateLocation',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
