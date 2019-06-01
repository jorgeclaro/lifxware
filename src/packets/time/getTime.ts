import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getTime: PacketBodyHandler = {
	type: 4,
	name: 'getTime',
	legacy: false,
	size: SIZE,
	tagged: false
};
