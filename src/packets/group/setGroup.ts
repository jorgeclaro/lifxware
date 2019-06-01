import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const setGroup: PacketBodyHandler = {
	type: 52,
	name: 'setGroup',
	legacy: false,
	size: SIZE,
	tagged: false
};
