import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const seWwanSubsInactive: PacketBodyHandler = {
	type: 204,
	name: 'setWanSubsInactive',
	legacy: false,
	size: SIZE,
	tagged: false
};
