import * as utils from '../../lib/utils';
import { Tag } from './tag';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 8;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const tags = utils.readUInt64LE(buf, offset);

	offset += 2;

	const obj: Tag = {
		tags
	};

	return obj;
}

function toBuffer(obj: Tag) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.write(obj.tags, offset, obj.tags.length, 'utf8');
	offset += 2;

	return buf;
}

export const setTags: PacketBodyHandler = {
	type: 27,
	name: 'setTags',
	legacy: true,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
