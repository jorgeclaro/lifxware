import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getLight: PacketBodyHandler = {
	type: 101,
	name: 'getState',
	legacy: false,
	size: SIZE,
	tagged: false
};
