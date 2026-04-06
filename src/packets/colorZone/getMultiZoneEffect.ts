import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getMultiZoneEffect: PacketBodyHandler = {
	type: 507,
	name: 'getMultiZoneEffect',
	legacy: false,
	size: SIZE,
	tagged: false
};
