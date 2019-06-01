import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const updateWanInfo: PacketBodyHandler = {
	type: 406,
	name: 'updateWanInfo',
	legacy: false,
	size: SIZE,
	tagged: false
};
