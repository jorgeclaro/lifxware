import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getOwner: PacketBodyHandler = {
	type: 51,
	name: 'getOwner',
	legacy: false,
	size: SIZE,
	tagged: false
};
