import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getHostFirmware: PacketBodyHandler = {
	type: 14,
	name: 'getHostFirmware',
	legacy: false,
	size: SIZE,
	tagged: false
};
