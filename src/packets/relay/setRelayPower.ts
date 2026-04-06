import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 3;

function toBuffer(obj: { relayIndex: number; level: number }) {
	const buf = Buffer.alloc(SIZE);
	buf.writeUInt8(obj.relayIndex, 0);
	buf.writeUInt16LE(obj.level, 1);
	return buf;
}

export const setRelayPower: PacketBodyHandler = {
	type: 817,
	name: 'relaySetPower',
	legacy: false,
	size: SIZE,
	tagged: false,
	toBuffer
};
