"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateColorZoneIndexOptional = exports.validateColorZoneIndex = exports.ApplyRequest = exports.ZONE_INDEX_MAXIMUM_VALUE = exports.ZONE_INDEX_MINIMUM_VALUE = void 0;
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
exports.ZONE_INDEX_MINIMUM_VALUE = 0;
exports.ZONE_INDEX_MAXIMUM_VALUE = 255;
/**
 * This type allows you to provide hints to the device about how the changes you make should be performed.
 * For example you can send multiple zones and have them all apply at once.
 * Application Request is stored as an unsigned 8-bit integer.
 */
var ApplyRequest;
(function (ApplyRequest) {
    /** Don't apply the requested changes until a message with APPLY or APPLY_ONLY is sent */
    ApplyRequest[ApplyRequest["NO_APPLY"] = 0] = "NO_APPLY";
    /** Apply the changes immediately and apply any pending changes */
    ApplyRequest[ApplyRequest["APPLY"] = 1] = "APPLY";
    /** Ignore the requested changes in this message and only apply pending changes */
    ApplyRequest[ApplyRequest["APPLY_ONLY"] = 2] = "APPLY_ONLY";
})(ApplyRequest = exports.ApplyRequest || (exports.ApplyRequest = {}));
/**
 * Checks validity of a light zone index
 * @param index Light zone index to validate
 */
function validateColorZoneIndex(index) {
    if (index < exports.ZONE_INDEX_MINIMUM_VALUE || index > exports.ZONE_INDEX_MAXIMUM_VALUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects zone to be a number between ' +
            exports.ZONE_INDEX_MINIMUM_VALUE +
            ' and ' +
            exports.ZONE_INDEX_MAXIMUM_VALUE)
            .build();
    }
}
exports.validateColorZoneIndex = validateColorZoneIndex;
/**
 * Checks validity of an optional light zone index
 * @param index Light zone index to validate
 */
function validateColorZoneIndexOptional(index) {
    if (index) {
        if (index < exports.ZONE_INDEX_MINIMUM_VALUE || index > exports.ZONE_INDEX_MAXIMUM_VALUE) {
            throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
                .withContextualMessage('Light expects zone to be a number between ' +
                exports.ZONE_INDEX_MINIMUM_VALUE +
                ' and ' +
                exports.ZONE_INDEX_MAXIMUM_VALUE)
                .build();
        }
    }
}
exports.validateColorZoneIndexOptional = validateColorZoneIndexOptional;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3Jab25lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3Jab25lL2NvbG9yWm9uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQ0FBc0Q7QUFDdEQsMERBQWdFO0FBRW5ELFFBQUEsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFFBQUEsd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBRTVDOzs7O0dBSUc7QUFDSCxJQUFZLFlBU1g7QUFURCxXQUFZLFlBQVk7SUFDdkIseUZBQXlGO0lBQ3pGLHVEQUFZLENBQUE7SUFFWixrRUFBa0U7SUFDbEUsaURBQVMsQ0FBQTtJQUVULGtGQUFrRjtJQUNsRiwyREFBYyxDQUFBO0FBQ2YsQ0FBQyxFQVRXLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBU3ZCO0FBc0JEOzs7R0FHRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLEtBQWE7SUFDbkQsSUFBSSxLQUFLLEdBQUcsZ0NBQXdCLElBQUksS0FBSyxHQUFHLGdDQUF3QixFQUFFO1FBQ3pFLE1BQU0sSUFBSSwyQkFBbUIsQ0FBQyxrQ0FBb0IsQ0FBQzthQUNqRCxxQkFBcUIsQ0FDckIsNENBQTRDO1lBQzNDLGdDQUF3QjtZQUN4QixPQUFPO1lBQ1AsZ0NBQXdCLENBQ3pCO2FBQ0EsS0FBSyxFQUFFLENBQUM7S0FDVjtBQUNGLENBQUM7QUFYRCx3REFXQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLDhCQUE4QixDQUFDLEtBQWE7SUFDM0QsSUFBSSxLQUFLLEVBQUU7UUFDVixJQUFJLEtBQUssR0FBRyxnQ0FBd0IsSUFBSSxLQUFLLEdBQUcsZ0NBQXdCLEVBQUU7WUFDekUsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2lCQUNqRCxxQkFBcUIsQ0FDckIsNENBQTRDO2dCQUMzQyxnQ0FBd0I7Z0JBQ3hCLE9BQU87Z0JBQ1AsZ0NBQXdCLENBQ3pCO2lCQUNBLEtBQUssRUFBRSxDQUFDO1NBQ1Y7S0FDRDtBQUNGLENBQUM7QUFiRCx3RUFhQyJ9