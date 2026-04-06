import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 3;
function toObject(buf) {
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    return {
        relayIndex: buf.readUInt8(0),
        level: buf.readUInt16LE(1)
    };
}
export const stateRelayPower = {
    type: 818,
    name: 'relayStatePower',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=stateRelayPower.js.map