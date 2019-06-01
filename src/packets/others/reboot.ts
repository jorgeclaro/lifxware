import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const reboot: PacketBodyHandler = {
	type: 38,
	name: 'reboot',
	legacy: false,
	size: SIZE,
	tagged: false
};
