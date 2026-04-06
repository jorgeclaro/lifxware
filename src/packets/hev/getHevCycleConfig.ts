import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getHevCycleConfig: PacketBodyHandler = {
	type: 145,
	name: 'getHevCycleConfig',
	legacy: false,
	size: SIZE,
	tagged: false
};
