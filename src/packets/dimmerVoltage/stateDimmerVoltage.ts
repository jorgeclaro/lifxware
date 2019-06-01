import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const stateDimmerVoltage: PacketBodyHandler = {
	type: 404,
	name: 'stateDimmerVoltage',
	legacy: false,
	size: SIZE,
	tagged: false
};
