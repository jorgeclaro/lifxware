import { ColorHSBK } from '../color/colorHSBK';
import { PacketBodyHandler } from '../../lib/packet';

const SIZE = 664;

function toBuffer(obj: {
	duration: number;
	apply: number;
	index: number;
	colors: ColorHSBK[];
}) {
	const buf = Buffer.alloc(SIZE);
	let offset = 0;

	buf.writeUInt32LE(obj.duration, offset);
	offset += 4;

	buf.writeUInt8(obj.apply, offset);
	offset += 1;

	buf.writeUInt16LE(obj.index, offset);
	offset += 2;

	buf.writeUInt8(obj.colors.length, offset);
	offset += 1;

	for (let i = 0; i < 82; i++) {
		const color = obj.colors[i] || { hue: 0, saturation: 0, brightness: 0, kelvin: 0 };
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

export const setExtendedColorZones: PacketBodyHandler = {
	type: 510,
	name: 'setExtendedColorZones',
	legacy: false,
	size: SIZE,
	tagged: false,
	toBuffer
};
