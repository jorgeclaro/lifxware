import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getMcuRailVoltage: PacketBodyHandler = {
	type: 36,
	name: 'getMcuRailVoltage',
	legacy: false,
	size: SIZE,
	tagged: false
};
