import { FactoryTestMode } from './factoryTestMode';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 1;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const enabled = Boolean(buf.readUInt8(offset));

	offset += 2;

	const obj: FactoryTestMode = {
		enabled
	};

	return obj;
}

function toBuffer(obj: FactoryTestMode) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt8(obj.enabled ? 1 : 0, offset);
	offset += 2;

	return buf;
}

export const setFactoryTestModeActive: PacketBodyHandler = {
	type: 39,
	name: 'getFactoryTestModeActive',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
