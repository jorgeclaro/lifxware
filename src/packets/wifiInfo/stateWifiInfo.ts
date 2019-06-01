import { WifiInfo } from './wifi';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 14;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const signal = buf.readFloatLE(offset);

	offset += 4;

	const tx = buf.readUInt32LE(offset);

	offset += 4;

	const rx = buf.readUInt32LE(offset);

	offset += 4;

	const mcuTemperature = buf.readUInt16LE(offset);

	offset += 2;

	const obj: WifiInfo = {
		signal,
		tx,
		rx,
		mcuTemperature
	};

	return obj;
}

function toBuffer(obj: WifiInfo) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeFloatLE(obj.signal, offset);
	offset += 4;

	buf.writeUInt32LE(obj.tx, offset);
	offset += 4;

	buf.writeUInt32LE(obj.rx, offset);
	offset += 4;

	buf.writeUInt16LE(obj.mcuTemperature, offset);
	offset += 2;

	return buf;
}

export const stateWifiInfo: PacketBodyHandler = {
	type: 17,
	name: 'stateWifiInfo',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
