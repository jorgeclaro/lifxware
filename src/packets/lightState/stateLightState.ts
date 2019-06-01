import * as utils from '../../lib/utils';
import { ColorHSBK } from '../color/colorHSBK';
import { LightState } from './lightState';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 52;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const hue = buf.readUInt16LE(offset);

	offset += 2;
	const saturation = buf.readUInt16LE(offset);

	offset += 2;
	const brightness = buf.readUInt16LE(offset);

	offset += 2;
	const kelvin = buf.readUInt16LE(offset);

	offset += 2;

	const color: ColorHSBK = {
		hue,
		saturation,
		brightness,
		kelvin
	};

	const dim = buf.readUInt16LE(offset);

	offset += 2;

	const power = buf.readUInt16LE(offset);

	offset += 2;

	let label = buf.toString('utf8', offset, offset + 32);

	label = label.replace(/\0/g, '');
	offset += 32;

	const tags = utils.readUInt64LE(buf, offset);

	offset += 8;

	const obj: LightState = {
		power,
		dim,
		color,
		label,
		tags
	};

	return obj;
}

function toBuffer(obj: LightState) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt16LE(obj.color.hue, offset);
	offset += 2;
	buf.writeUInt16LE(obj.color.saturation, offset);
	offset += 2;
	buf.writeUInt16LE(obj.color.brightness, offset);
	offset += 2;
	buf.writeUInt16LE(obj.color.kelvin, offset);
	offset += 2;

	buf.writeUInt16LE(obj.dim, offset);
	offset += 2;

	buf.writeUInt16LE(obj.power, offset);
	offset += 2;

	buf.write(obj.label, offset, 32, 'utf8');
	offset += 32;

	utils.writeUInt64LE(buf, offset, obj.tags);
	offset += 8;

	return buf;
}

export const stateLight: PacketBodyHandler = {
	type: 107,
	name: 'stateLight',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
