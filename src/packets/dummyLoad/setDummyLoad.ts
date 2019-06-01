import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const setDummyLoad: PacketBodyHandler = {
	type: 10,
	name: 'setDummyLoad',
	legacy: false,
	size: SIZE,
	tagged: false
};
