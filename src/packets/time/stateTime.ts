import * as utils from '../../lib/utils';
import { Time } from './time';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 8;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const time = utils.readUInt64LE(buf, offset);

	offset += 8;

	const obj: Time = {
		time
	};

	return obj;
}

function toBuffer(obj: Time) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	utils.writeUInt64LE(buf, offset, obj.time);
	offset += 8;

	return buf;
}

export const stateTime: PacketBodyHandler = {
	type: 6,
	name: 'stateTime',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
