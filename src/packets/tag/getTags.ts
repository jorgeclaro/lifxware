import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getTags: PacketBodyHandler = {
	type: 26,
	name: 'getTags',
	legacy: true,
	size: SIZE,
	tagged: false
};
