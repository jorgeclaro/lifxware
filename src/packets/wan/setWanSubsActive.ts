import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const setWanSubsActive: PacketBodyHandler = {
	type: 203,
	name: 'setWanSubsActive',
	legacy: false,
	size: SIZE,
	tagged: false
};
