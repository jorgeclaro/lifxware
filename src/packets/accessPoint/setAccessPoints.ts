import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const setAccessPoints: PacketBodyHandler = {
	type: 305,
	name: 'setAccessPoints',
	legacy: false,
	size: SIZE,
	tagged: false
};
