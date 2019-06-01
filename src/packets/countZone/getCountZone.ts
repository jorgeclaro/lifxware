import { CountZoneRequest } from './countZone';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 1;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const scan = Boolean(buf.readUInt8(offset));

	offset += 1;

	const obj: CountZoneRequest = {
		scan
	};

	return obj;
}

function toBuffer(obj: CountZoneRequest) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt8(obj.scan ? 1 : 0, offset);
	offset += 1;

	return buf;
}

export const getCountZone: PacketBodyHandler = {
	type: 504,
	name: 'getCountZone',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
