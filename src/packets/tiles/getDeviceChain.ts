import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getDeviceChain: PacketBodyHandler = {
	type: 701,
	name: 'getDeviceChain',
	legacy: false,
	size: SIZE,
	tagged: false
};
