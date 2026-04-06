import { ColorHSBK } from '../color/colorHSBK';
import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 188;

export interface TileEffectSettings {
	instanceid: number;
	type: number;
	speed: number;
	duration: bigint;
	parameter: number[];
	paletteCount: number;
	palette: ColorHSBK[];
}

function toBuffer(obj: TileEffectSettings) {
	const buf = Buffer.alloc(SIZE);
	let offset = 0;

	buf.writeUInt8(0, offset);
	offset += 1;

	buf.writeUInt8(0, offset);
	offset += 1;

	buf.writeUInt32LE(obj.instanceid, offset);
	offset += 4;

	buf.writeUInt8(obj.type, offset);
	offset += 1;

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

	buf.writeUInt8(obj.paletteCount, offset);
	offset += 1;

	for (let i = 0; i < 16; i++) {
		const color = obj.palette[i] || { hue: 0, saturation: 0, brightness: 0, kelvin: 0 };
		buf.writeUInt16LE(color.hue, offset);
		offset += 2;
		buf.writeUInt16LE(color.saturation, offset);
		offset += 2;
		buf.writeUInt16LE(color.brightness, offset);
		offset += 2;
		buf.writeUInt16LE(color.kelvin, offset);
		offset += 2;
	}

	return buf;
}

export const setTileEffect: PacketBodyHandler = {
	type: 719,
	name: 'setTileEffect',
	legacy: false,
	size: SIZE,
	tagged: false,
	toBuffer
};
