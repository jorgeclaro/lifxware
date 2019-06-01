import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getGroup: PacketBodyHandler = {
	type: 51,
	name: 'getGroup',
	legacy: false,
	size: SIZE,
	tagged: false
};
