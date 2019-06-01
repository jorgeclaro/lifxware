import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 16;

export const stateInfo: PacketBodyHandler = {
	type: 35,
	name: 'stateInfo',
	legacy: false,
	size: SIZE,
	tagged: false
};
