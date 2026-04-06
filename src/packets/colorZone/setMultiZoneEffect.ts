import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 59;

function toBuffer(obj: {
	instanceid: number;
	type: number;
	speed: number;
	duration: bigint;
	parameter: number[];
}) {
	const buf = Buffer.alloc(SIZE);
	let offset = 0;

	buf.writeUInt32LE(obj.instanceid, offset);
	offset += 4;

	buf.writeUInt8(obj.type, offset);
	offset += 1;

	buf.writeUInt16LE(0, offset);
	offset += 2;

	buf.writeUInt32LE(obj.speed, offset);
	offset += 4;

	buf.writeBigUInt64LE(obj.duration, offset);
	offset += 8;

	buf.writeUInt32LE(0, offset);
	offset += 4;

	buf.writeUInt32LE(0, offset);
	offset += 4;

	for (let i = 0; i < 8; i++) {
		buf.writeUInt32LE(obj.parameter[i] || 0, offset);
		offset += 4;
	}

	return buf;
}

export const setMultiZoneEffect: PacketBodyHandler = {
	type: 508,
	name: 'setMultiZoneEffect',
	legacy: false,
	size: SIZE,
	tagged: false,
	toBuffer
};
