import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getTemperature: PacketBodyHandler = {
	type: 110,
	name: 'getTemperature',
	legacy: false,
	size: SIZE,
	tagged: false
};
