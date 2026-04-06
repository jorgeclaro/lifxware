import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getHevCycle: PacketBodyHandler = {
	type: 142,
	name: 'getHevCycle',
	legacy: false,
	size: SIZE,
	tagged: false
};
