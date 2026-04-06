import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getButton: PacketBodyHandler = {
	type: 905,
	name: 'getButton',
	legacy: false,
	size: SIZE,
	tagged: false
};
