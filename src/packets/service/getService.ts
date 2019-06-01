import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getService: PacketBodyHandler = {
	type: 2,
	name: 'getService',
	legacy: false,
	size: SIZE,
	tagged: true
};
