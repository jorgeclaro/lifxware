import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getAmbientLight: PacketBodyHandler = {
	type: 401,
	name: 'getAmbientLight',
	legacy: false,
	size: SIZE,
	tagged: false
};
