import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const setOwner: PacketBodyHandler = {
	type: 55,
	name: 'setOwner',
	legacy: false,
	size: SIZE,
	tagged: false
};
