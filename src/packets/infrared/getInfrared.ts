import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getInfrared: PacketBodyHandler = {
	type: 120,
	name: 'getInfrared',
	legacy: false,
	size: SIZE,
	tagged: false
};
