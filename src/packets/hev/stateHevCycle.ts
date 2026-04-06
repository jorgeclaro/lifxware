import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 9;

function toObject(buf: Buffer) {
	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	return {
		durationS: buf.readUInt32LE(0),
		remainingS: buf.readUInt32LE(4),
		lastPower: Boolean(buf.readUInt8(8))
	};
}

export const stateHevCycle: PacketBodyHandler = {
	type: 144,
	name: 'stateHevCycle',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject
};
