import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const stateWanConnection: PacketBodyHandler = {
	type: 202,
	name: 'stateWanConnection',
	legacy: false,
	size: SIZE,
	tagged: false
};
