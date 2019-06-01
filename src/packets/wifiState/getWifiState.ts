import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getWifiState: PacketBodyHandler = {
	type: 301,
	name: 'getWifiState',
	legacy: false,
	size: SIZE,
	tagged: false
};
