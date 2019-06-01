import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getDummyLoad: PacketBodyHandler = {
	type: 9,
	name: 'getDummyLoad',
	legacy: false,
	size: SIZE,
	tagged: false
};
