import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 5;

function toBuffer(obj: { enable: boolean; durationS: number }) {
	const buf = Buffer.alloc(SIZE);
	buf.writeUInt8(obj.enable ? 1 : 0, 0);
	buf.writeUInt32LE(obj.durationS, 1);
	return buf;
}

export const setHevCycle: PacketBodyHandler = {
	type: 143,
	name: 'setHevCycle',
	legacy: false,
	size: SIZE,
	tagged: false,
	toBuffer
};
