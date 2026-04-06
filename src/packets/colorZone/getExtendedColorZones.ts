import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 0;

export const getExtendedColorZones: PacketBodyHandler = {
	type: 511,
	name: 'getExtendedColorZones',
	legacy: false,
	size: SIZE,
	tagged: false
};
