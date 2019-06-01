import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getVersion: PacketBodyHandler = {
	type: 32,
	name: 'getVersion',
	legacy: false,
	size: SIZE,
	tagged: false
};
