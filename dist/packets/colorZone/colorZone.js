import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
export const ZONE_INDEX_MINIMUM_VALUE = 0;
export const ZONE_INDEX_MAXIMUM_VALUE = 255;
/**
 * This type allows you to provide hints to the device about how the changes you make should be performed.
 * For example you can send multiple zones and have them all apply at once.
 * Application Request is stored as an unsigned 8-bit integer.
 */
export var ApplyRequest;
(function (ApplyRequest) {
    /** Don't apply the requested changes until a message with APPLY or APPLY_ONLY is sent */
    ApplyRequest[ApplyRequest["NO_APPLY"] = 0] = "NO_APPLY";
    /** Apply the changes immediately and apply any pending changes */
    ApplyRequest[ApplyRequest["APPLY"] = 1] = "APPLY";
    /** Ignore the requested changes in this message and only apply pending changes */
    ApplyRequest[ApplyRequest["APPLY_ONLY"] = 2] = "APPLY_ONLY";
})(ApplyRequest || (ApplyRequest = {}));
/**
 * Checks validity of a light zone index
 * @param index Light zone index to validate
 */
export function validateColorZoneIndex(index) {
    if (index < ZONE_INDEX_MINIMUM_VALUE || index > ZONE_INDEX_MAXIMUM_VALUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects zone to be a number between ' +
            ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
}
/**
 * Checks validity of an optional light zone index
 * @param index Light zone index to validate
 */
export function validateColorZoneIndexOptional(index) {
    if (index) {
        if (index < ZONE_INDEX_MINIMUM_VALUE || index > ZONE_INDEX_MAXIMUM_VALUE) {
            throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Light expects zone to be a number between ' +
                ZONE_INDEX_MINIMUM_VALUE +
                ' and ' +
                ZONE_INDEX_MAXIMUM_VALUE)
                .build();
        }
    }
}
//# sourceMappingURL=colorZone.js.map