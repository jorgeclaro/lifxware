import { ResetSwitch } from './resetSwitch';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 1;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const position = buf.readUInt8(offset);

	offset += 2;

	const obj: ResetSwitch = {
		position
	};

	return obj;
}

function toBuffer(obj: ResetSwitch) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt8(obj.position ? 1 : 0, offset);
	offset += 2;

	return buf;
}

export const stateResetSwitch: PacketBodyHandler = {
	type: 8,
	name: 'stateResetSwitchPosition',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
