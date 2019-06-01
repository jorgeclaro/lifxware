import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getResetSwitchState: PacketBodyHandler = {
	type: 7,
	name: 'getResetSwitchPosition',
	legacy: false,
	size: SIZE,
	tagged: false
};
