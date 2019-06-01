import {
	ColorHSBK,
	HSBK_MINIMUM_RAW,
	HSBK_MAXIMUM_RAW,
	HSBK_MINIMUM_KELVIN,
	HSBK_MAXIMUM_KELVIN
} from '../color/colorHSBK';
import { WaveformRequest } from './waveform';
import { HSBK_DEFAULT_KELVIN } from '../color/colorHSBK';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 21;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	offset += 1;

	const isTransient = Boolean(buf.readUInt8(offset));

	offset += 1;

	const hue = buf.readUInt16LE(offset);

	offset += 2;
	const saturation = buf.readUInt16LE(offset);

	offset += 2;
	const brightness = buf.readUInt16LE(offset);

	offset += 2;
	const kelvin = buf.readUInt16LE(offset);

	offset += 2;

	const period = buf.readUInt32LE(offset);

	offset += 4;

	const cycles = buf.readFloatLE(offset);

	offset += 4;

	const skewRatio = buf.readUInt16LE(offset);

	offset += 2;

	const waveform = buf.readUInt8(offset);

	offset += 1;

	const setHue = buf.readUInt8(offset) === 1 ? true : false;

	offset += 1;

	const setSaturation = buf.readUInt8(offset) === 1 ? true : false;

	offset += 1;

	const setBrightness = buf.readUInt8(offset) === 1 ? true : false;

	offset += 1;

	const setKelvin = buf.readUInt8(offset) === 1 ? true : false;

	const color: ColorHSBK = {
		hue,
		saturation,
		brightness,
		kelvin
	};

	const obj: WaveformRequest = {
		isTransient,
		color,
		period,
		cycles,
		skewRatio,
		waveform,
		setHue,
		setSaturation,
		setBrightness,
		setKelvin
	};

	return obj;
}

//eslint-disable-next-line complexity
function toBuffer(obj: WaveformRequest) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	/** Reserved */
	offset += 1;

	buf.writeUInt8(obj.isTransient ? 1 : 0, offset);
	offset += 1;

	if (obj.color.hue < HSBK_MINIMUM_RAW || obj.color.hue > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects hue to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}

	buf.writeUInt16LE(obj.color.hue, offset);
	offset += 2;

	if (obj.color.saturation < HSBK_MINIMUM_RAW || obj.color.saturation > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects saturation to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}

	buf.writeUInt16LE(obj.color.saturation, offset);
	offset += 2;

	if (obj.color.brightness < HSBK_MINIMUM_RAW || obj.color.brightness > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects brightness to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}

	buf.writeUInt16LE(obj.color.brightness, offset);
	offset += 2;

	if (!obj.color.kelvin) {
		obj.color.kelvin = HSBK_DEFAULT_KELVIN;
	}

	if (obj.color.kelvin < HSBK_MINIMUM_KELVIN || obj.color.kelvin > HSBK_MAXIMUM_KELVIN) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects kelvin to be a number between ' + HSBK_MINIMUM_KELVIN + ' and ' + HSBK_MAXIMUM_KELVIN
			)
			.build();
	}

	buf.writeUInt16LE(obj.color.kelvin, offset);
	offset += 2;

	buf.writeUInt32LE(obj.period, offset);
	offset += 4;

	buf.writeFloatLE(obj.cycles, offset);
	offset += 4;

	buf.writeInt16LE(obj.skewRatio, offset);
	offset += 2;

	if (obj.waveform < 0 || obj.waveform > 5) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage('Light expects brightness to be a number between 0 and 5')
			.build();
	}

	buf.writeUInt8(obj.waveform, offset);
	offset += 1;

	buf.writeUInt8(obj.setHue ? 1 : 0, offset);
	offset += 1;

	buf.writeUInt8(obj.setSaturation ? 1 : 0, offset);
	offset += 1;

	buf.writeUInt8(obj.setBrightness ? 1 : 0, offset);
	offset += 1;

	buf.writeUInt8(obj.setKelvin ? 1 : 0, offset);

	return buf;
}

export const setWaveformOptional: PacketBodyHandler = {
	type: 119,
	name: 'setWaveformOprional',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
