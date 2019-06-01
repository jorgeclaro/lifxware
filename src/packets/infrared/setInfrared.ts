import { ColorInfrared, ColorInfraredRequest } from './colorInfrared';
import { PacketBodyHandler } from '../../lib/packet';
import { HSBK_MINIMUM_RAW, HSBK_MAXIMUM_RAW } from '../color/colorHSBK';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 2;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const brightness = buf.readUInt16LE(offset);

	offset += 2;

	const obj: ColorInfrared = {
		brightness
	};

	return obj;
}

function toBuffer(obj: ColorInfraredRequest) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	if (obj.brightness < HSBK_MINIMUM_RAW && obj.brightness > HSBK_MAXIMUM_RAW) {
		throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
			.withContextualMessage(
				'Light expects brightness to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW
			)
			.build();
	}
	buf.writeUInt16LE(obj.brightness, offset);
	offset += 2;

	return buf;
}

export const setInfrared: PacketBodyHandler = {
	type: 122,
	name: 'setInfrared',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
