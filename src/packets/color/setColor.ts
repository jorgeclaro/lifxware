import {
	ColorHSBK,
	ColorHSBKRequest,
	HSBK_DEFAULT_KELVIN,
	validateRawColorHSBK,
	validateRawColorHSB
} from './colorHSBK';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 13;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const stream = buf.readUInt8(offset);

	offset += 1;

	const hue = buf.readUInt16LE(offset);

	offset += 2;
	const saturation = buf.readUInt16LE(offset);

	offset += 2;
	const brightness = buf.readUInt16LE(offset);

	offset += 2;
	const kelvin = buf.readUInt16LE(offset);

	offset += 2;
	const duration = buf.readUInt32LE(offset);

	offset += 4;

	const color: ColorHSBK = {
		hue,
		saturation,
		brightness,
		kelvin
	};

	const obj: ColorHSBKRequest = {
		stream,
		color,
		duration
	};

	return obj;
}

//eslint-disable-next-line complexity
function toBuffer(obj: ColorHSBKRequest) {
	if (obj.color.kelvin) {
		validateRawColorHSBK(obj.color.hue, obj.color.saturation, obj.color.brightness, obj.color.kelvin);
	} else {
		validateRawColorHSB(obj.color.hue, obj.color.saturation, obj.color.brightness);
	}

	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	/** obj.stream field has unknown function so leave it as 0 */
	offset += 1;

	buf.writeUInt16LE(obj.color.hue, offset);
	offset += 2;

	buf.writeUInt16LE(obj.color.saturation, offset);
	offset += 2;

	buf.writeUInt16LE(obj.color.brightness, offset);
	offset += 2;

	if (!obj.color.kelvin) {
		obj.color.kelvin = HSBK_DEFAULT_KELVIN;
	}

	buf.writeUInt16LE(obj.color.kelvin, offset);
	offset += 2;

	/** Duration is 0 by default */
	if (obj.duration) {
		buf.writeUInt32LE(obj.duration, offset);
	}
	offset += 4;

	return buf;
}

export const setColor: PacketBodyHandler = {
	type: 102,
	name: 'setColor',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
