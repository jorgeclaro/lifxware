import { ServiceErrorBuilder } from '../../lib/error';
import { ER_PACKET_INVALID_SIZE } from '../../errors/packetErrors';
const SIZE = 1;
function toObject(buf) {
    if (buf.length !== SIZE) {
        throw new ServiceErrorBuilder(ER_PACKET_INVALID_SIZE).build();
    }
    return {
        result: buf.readUInt8(0)
    };
}
export const stateLastHevCycleResult = {
    type: 149,
    name: 'stateLastHevCycleResult',
    legacy: false,
    size: SIZE,
    tagged: false,
    toObject
};
//# sourceMappingURL=stateLastHevCycleResult.js.map