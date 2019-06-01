import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getLocation: PacketBodyHandler = {
	type: 48,
	name: 'getLocation',
	legacy: false,
	size: SIZE,
	tagged: false
};
