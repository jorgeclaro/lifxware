import * as utils from '../../lib/utils';
import { CountZone } from './countZone';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 9;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const time = utils.readUInt64LE(buf, offset);

	offset += 8;

	const count = buf.readUInt8(offset);

	offset += 1;

	const obj: CountZone = {
		time,
		count
	};

	return obj;
}

export const stateCountZone: PacketBodyHandler = {
	type: 505,
	name: 'stateCountZone',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject
};
