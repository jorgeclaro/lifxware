import * as utils from '../../lib/utils';
import { TagLabels } from './tagLabel';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 40;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const tagLabels = utils.readUInt64LE(buf, offset);

	offset += 2;

	const obj: TagLabels = {
		tagLabels
	};

	return obj;
}

function toBuffer(obj: TagLabels) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.write(obj.tagLabels, offset, obj.tagLabels.length, 'utf8');
	offset += 2;

	return buf;
}

export const setTagLabels: PacketBodyHandler = {
	type: 30,
	name: 'setTagLabels',
	legacy: true,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
