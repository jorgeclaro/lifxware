import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getAccessPoints: PacketBodyHandler = {
	type: 304,
	name: 'getAccessPoints',
	legacy: false,
	size: SIZE,
	tagged: false
};
