import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getWifiInfo: PacketBodyHandler = {
	type: 16,
	name: 'getWifiInfo',
	legacy: false,
	size: SIZE,
	tagged: false
};
