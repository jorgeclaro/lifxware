import { EchoResponse } from './echo';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 64;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	let payload = buf.toString('utf8', offset, offset + 64);

	payload = payload.replace(/\0/g, '');
	offset += 64;

	const obj: EchoResponse = {
		payload
	};

	return obj;
}

function toBuffer(obj: EchoResponse) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.write(obj.payload, offset, 64);
	offset += 64;

	return buf;
}

export const echoResponse: PacketBodyHandler = {
	type: 59,
	name: 'echoResponse',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
