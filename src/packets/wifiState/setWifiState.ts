import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 1;

export const setWifiState: PacketBodyHandler = {
	type: 302,
	name: 'setWifiState',
	legacy: false,
	size: SIZE,
	tagged: false
};
