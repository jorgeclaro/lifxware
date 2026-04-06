import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 1;

function toBuffer(obj: { relayIndex: number }) {
	const buf = Buffer.alloc(SIZE);
	buf.writeUInt8(obj.relayIndex, 0);
	return buf;
}

export const getRelayPower: PacketBodyHandler = {
	type: 816,
	name: 'relayGetPower',
	legacy: false,
	size: SIZE,
	tagged: false,
	toBuffer
};
