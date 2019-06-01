import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getPowerLegacy: PacketBodyHandler = {
	type: 20,
	name: 'getPowerLegacy',
	legacy: true,
	size: SIZE,
	tagged: false
};
