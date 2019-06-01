import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getLabel: PacketBodyHandler = {
	type: 23,
	name: 'getLanel',
	legacy: false,
	size: SIZE,
	tagged: false
};
