import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getDimmerVoltage: PacketBodyHandler = {
	type: 403,
	name: 'getDimmerVoltage',
	legacy: false,
	size: SIZE,
	tagged: false
};
