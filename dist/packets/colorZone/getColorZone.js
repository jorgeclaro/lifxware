import { ZONE_INDEX_MINIMUM_VALUE, ZONE_INDEX_MAXIMUM_VALUE } from './colorZone';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
const SIZE = 2;
function toBuffer(obj) {
    const buf = Buffer.alloc(SIZE);
    buf.fill(0);
    let offset = 0;
    if (obj.startIndex < ZONE_INDEX_MINIMUM_VALUE || obj.startIndex > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid startIndex value given for getColorZones LIFX packet, must be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.startIndex, offset);
    offset += 1;
    if (obj.endIndex < ZONE_INDEX_MINIMUM_VALUE || obj.endIndex > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Invalid endIndex value given for getColorZones LIFX packet, must be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
    buf.writeUInt8(obj.endIndex, offset);
    offset += 1;
    return buf;
}
export const getColorZone = {
    type: 502,
    name: 'getColorZone',
    legacy: false,
    size: SIZE,
    tagged: false,
    toBuffer
};
//# sourceMappingURL=getColorZone.js.map