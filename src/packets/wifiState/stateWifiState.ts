import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const stateWifiState: PacketBodyHandler = {
	type: 303,
	name: 'stateWifiState',
	legacy: false,
	size: SIZE,
	tagged: false
};
