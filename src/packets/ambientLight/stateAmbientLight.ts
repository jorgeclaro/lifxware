import { AmbientLight } from './ambientLight';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 4;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const flux = buf.readFloatLE(offset);

	offset += 4;

	const obj: AmbientLight = {
		flux
	};

	return obj;
}

function toBuffer(obj: AmbientLight) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeFloatLE(obj.flux, offset);
	offset += 4;

	return buf;
}

export const stateAmbientLight: PacketBodyHandler = {
	type: 402,
	name: 'stateAmbientLight',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
