import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const stateDummyLoad: PacketBodyHandler = {
	type: 11,
	name: 'stateDummyLoad',
	legacy: false,
	size: SIZE,
	tagged: false
};
