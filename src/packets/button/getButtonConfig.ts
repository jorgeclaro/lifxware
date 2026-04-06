import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getButtonConfig: PacketBodyHandler = {
	type: 909,
	name: 'getButtonConfig',
	legacy: false,
	size: SIZE,
	tagged: false
};
