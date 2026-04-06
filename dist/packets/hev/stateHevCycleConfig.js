import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 5;
function toObject(buf) {
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    return {
        indication: Boolean(buf.readUInt8(0)),
        durationS: buf.readUInt32LE(1)
    };
}
export const stateHevCycleConfig = {
    type: 147,
    name: 'stateHevCycleConfig',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=stateHevCycleConfig.js.map