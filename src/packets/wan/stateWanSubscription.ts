import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const stateWanSubscription: PacketBodyHandler = {
	type: 205,
	name: 'stateWanSubs',
	legacy: false,
	size: SIZE,
	tagged: false
};
