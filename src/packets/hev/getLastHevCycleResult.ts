import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getLastHevCycleResult: PacketBodyHandler = {
	type: 148,
	name: 'getLastHevCycleResult',
	legacy: false,
	size: SIZE,
	tagged: false
};
