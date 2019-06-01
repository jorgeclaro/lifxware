import { AccessPoint } from '../wifiInfo/wifi';
import { PacketBodyHandler } from '../../lib/packet';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';

const SIZE = 32;

function toObject(buf: Buffer) {
	let offset = 0;

	if (buf.length !== SIZE) {
		throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
	}

	const iface = buf.readUInt8(offset);

	offset += 2;
	const ssid = buf.toString('utf8', offset, offset + 32);

	offset += 2;
	const securityProtocol = buf.readUInt8(offset);

	offset += 2;
	const strength = buf.readUInt16LE(offset);

	offset += 2;
	const channel = buf.readUInt16LE(offset);

	offset += 2;

	const accessPoint: AccessPoint = {
		iface,
		ssid,
		securityProtocol,
		strength,
		channel
	};

	return accessPoint;
}

function toBuffer(obj: AccessPoint) {
	const buf = Buffer.alloc(SIZE);

	buf.fill(0);
	let offset = 0;

	buf.writeUInt8(obj.iface, offset);
	offset += 2;
	buf.write(obj.ssid, offset, 32);
	offset += 2;
	buf.writeUInt8(obj.securityProtocol, offset);
	offset += 2;
	buf.writeUInt16LE(obj.strength, offset);
	offset += 2;
	buf.writeUInt16LE(obj.channel, offset);
	offset += 2;

	return buf;
}

export const stateAccessPoints: PacketBodyHandler = {
	type: 306,
	name: 'stateAccessPoints',
	legacy: false,
	size: SIZE,
	tagged: false,
	toObject,
	toBuffer
};
