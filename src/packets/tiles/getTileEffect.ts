import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 2;

export const getTileEffect: PacketBodyHandler = {
	type: 718,
	name: 'getTileEffect',
	legacy: false,
	size: SIZE,
	tagged: false
};
