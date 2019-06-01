import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const setFactoryTestModeInactive: PacketBodyHandler = {
	type: 40,
	name: 'setFactoryTestModeInactive',
	legacy: false,
	size: SIZE,
	tagged: false
};
