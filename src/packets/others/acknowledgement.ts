import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const acknowledgement: PacketBodyHandler = {
	type: 45,
	name: 'acknowledgement',
	legacy: false,
	size: SIZE,
	tagged: false
};
