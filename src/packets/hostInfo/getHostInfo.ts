import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getHostInfo: PacketBodyHandler = {
	type: 12,
	name: 'getHostInfo',
	legacy: false,
	size: SIZE,
	tagged: false
};
