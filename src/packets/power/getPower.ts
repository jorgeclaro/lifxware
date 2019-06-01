import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getPower: PacketBodyHandler = {
	type: 116,
	name: 'getPower',
	legacy: false,
	size: SIZE,
	tagged: false
};
