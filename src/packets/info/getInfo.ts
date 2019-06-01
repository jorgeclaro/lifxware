import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getInfo: PacketBodyHandler = {
	type: 34,
	name: 'getInfo',
	legacy: false,
	size: SIZE,
	tagged: false
};
