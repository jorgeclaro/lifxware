import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 4;

export const stateMcuRailVoltage: PacketBodyHandler = {
	type: 37,
	name: 'stateMcuRailVoltage',
	legacy: false,
	size: SIZE,
	tagged: false
};
