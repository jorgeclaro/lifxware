import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getWifiFirmware: PacketBodyHandler = {
	type: 18,
	name: 'getWifiFirmware',
	legacy: false,
	size: SIZE,
	tagged: false
};
