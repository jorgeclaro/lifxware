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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3Jab25lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3Jab25lL2NvbG9yWm9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRSxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7QUFDMUMsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBRTVDOzs7O0dBSUc7QUFDSCxNQUFNLENBQU4sSUFBWSxZQVNYO0FBVEQsV0FBWSxZQUFZO0lBQ3ZCLHlGQUF5RjtJQUN6Rix1REFBWSxDQUFBO0lBRVosa0VBQWtFO0lBQ2xFLGlEQUFTLENBQUE7SUFFVCxrRkFBa0Y7SUFDbEYsMkRBQWMsQ0FBQTtBQUNmLENBQUMsRUFUVyxZQUFZLEtBQVosWUFBWSxRQVN2QjtBQXNCRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsS0FBYTtJQUNuRCxJQUFJLEtBQUssR0FBRyx3QkFBd0IsSUFBSSxLQUFLLEdBQUcsd0JBQXdCLEVBQUUsQ0FBQztRQUMxRSxNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQ3JCLDRDQUE0QztZQUMzQyx3QkFBd0I7WUFDeEIsT0FBTztZQUNQLHdCQUF3QixDQUN6QjthQUNBLEtBQUssRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNGLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsOEJBQThCLENBQUMsS0FBYTtJQUMzRCxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ1gsSUFBSSxLQUFLLEdBQUcsd0JBQXdCLElBQUksS0FBSyxHQUFHLHdCQUF3QixFQUFFLENBQUM7WUFDMUUsTUFBTSxJQUFJLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO2lCQUNqRCxxQkFBcUIsQ0FDckIsNENBQTRDO2dCQUMzQyx3QkFBd0I7Z0JBQ3hCLE9BQU87Z0JBQ1Asd0JBQXdCLENBQ3pCO2lCQUNBLEtBQUssRUFBRSxDQUFDO1FBQ1gsQ0FBQztJQUNGLENBQUM7QUFDRixDQUFDIn0=