import { ColorHSBK } from '../color/colorHSBK';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
import * as utils from '../../lib/utils';

const SIZE = 187;

function toObject(buf: Buffer) {
	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	let offset = 0;

	offset += 1;

	const settings = {
		instanceid: buf.readUInt32LE(offset + 1),
		type: buf.readUInt8(offset + 5),
		speed: buf.readUInt32LE(offset + 6),
		duration: utils.readUInt64LE(buf, offset + 10)
	};

	offset += 18;

	const parameter: number[] = [];
	for (let i = 0; i < 8; i++) {
		parameter.push(buf.readUInt32LE(offset));
		offset += 4;
	}

	const paletteCount = buf.readUInt8(offset);
	offset += 1;

	const palette: ColorHSBK[] = [];
	for (let i = 0; i < 16; i++) {
		palette.push({
			hue: buf.readUInt16LE(offset),
			saturation: buf.readUInt16LE(offset + 2),
			brightness: buf.readUInt16LE(offset + 4),
			kelvin: buf.readUInt16LE(offset + 6)
		});
		offset += 8;
	}

	return {
		...settings,
		parameter,
		paletteCount,
		palette
	};
}

export const stateTileEffect: PacketBodyHandler = {
	type: 720,
	name: 'stateTileEffect',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject
};
