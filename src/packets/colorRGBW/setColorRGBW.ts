import { ColorRGBW, ColorRGBWRequest, validateRawColorRgbw } from './colorRGBW';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 8;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const red = buf.readUInt16LE(offset);

	offset += 2;
	const green = buf.readUInt16LE(offset);

	offset += 2;
	const blue = buf.readUInt16LE(offset);

	offset += 2;
	const white = buf.readUInt16LE(offset);

	offset += 2;

	const color: ColorRGBW = {
		red,
		green,
		blue,
		white
	};

	const obj: ColorRGBWRequest = {
		color
	};

	return obj;
}

//eslint-disable-next-line complexity
function toBuffer(obj: ColorRGBWRequest) {
	validateRawColorRgbw(obj.color.red, obj.color.green, obj.color.blue, obj.color.white);

	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt16LE(obj.color.red, offset);
	offset += 2;

	buf.writeUInt16LE(obj.color.green, offset);
	offset += 2;

	buf.writeUInt16LE(obj.color.blue, offset);
	offset += 2;

	buf.writeUInt16LE(obj.color.white, offset);
	offset += 2;

	return buf;
}

export const setLightColorRGBW: PacketBodyHandler = {
	type: 106,
	name: 'setLightColorRGBW',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
