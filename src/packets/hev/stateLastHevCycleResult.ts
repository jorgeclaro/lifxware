import { LightLastHevCycleResult } from './hev';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 1;

function toObject(buf: Buffer) {
	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	return {
		result: buf.readUInt8(0) as LightLastHevCycleResult
	};
}

export const stateLastHevCycleResult: PacketBodyHandler = {
	type: 149,
	name: 'stateLastHevCycleResult',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject
};
