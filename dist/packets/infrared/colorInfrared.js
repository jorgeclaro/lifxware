"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalisedToPacketInfraed = exports.packetToNormalisedInfrared = exports.validateNormalisedColorInfrared = exports.IR_MAXIMUM_BRIGHTNESS = exports.IR_MINIMUM_BRIGHTNESS = exports.IR_MAXIMUM_RAW = exports.IR_MINIMUM_RAW = void 0;
const utils_1 = require("../../lib/utils");
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
exports.IR_MINIMUM_RAW = 0;
exports.IR_MAXIMUM_RAW = 65535;
exports.IR_MINIMUM_BRIGHTNESS = 0;
exports.IR_MAXIMUM_BRIGHTNESS = 100;
/**
 * Checks validity of IR brightness
 * @param brightness IR brightness to validate
 */
function validateNormalisedColorInfrared(brightness) {
    if (brightness < exports.IR_MINIMUM_BRIGHTNESS || brightness > exports.IR_MAXIMUM_BRIGHTNESS) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' +
            exports.IR_MINIMUM_BRIGHTNESS +
            ' and ' +
            exports.IR_MAXIMUM_BRIGHTNESS)
            .build();
    }
}
exports.validateNormalisedColorInfrared = validateNormalisedColorInfrared;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param {Object} packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return {Object} hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
function packetToNormalisedInfrared(packetColor) {
    const brightness = (0, utils_1.round)((packetColor.brightness / exports.IR_MAXIMUM_RAW) * exports.IR_MAXIMUM_BRIGHTNESS, 2);
    return {
        brightness
    };
}
exports.packetToNormalisedInfrared = packetToNormalisedInfrared;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param irColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
function normalisedToPacketInfraed(irColor) {
    const brightness = (0, utils_1.round)((irColor.brightness / exports.IR_MAXIMUM_BRIGHTNESS) * exports.IR_MAXIMUM_RAW, 0);
    return {
        brightness
    };
}
exports.normalisedToPacketInfraed = normalisedToPacketInfraed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JJbmZyYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wYWNrZXRzL2luZnJhcmVkL2NvbG9ySW5mcmFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXdDO0FBQ3hDLDJDQUFzRDtBQUN0RCwwREFBZ0U7QUFFbkQsUUFBQSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFFBQUEsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUV2QixRQUFBLHFCQUFxQixHQUFHLENBQUMsQ0FBQztBQUMxQixRQUFBLHFCQUFxQixHQUFHLEdBQUcsQ0FBQztBQVV6Qzs7O0dBR0c7QUFDSCxTQUFnQiwrQkFBK0IsQ0FBQyxVQUFrQjtJQUNqRSxJQUFJLFVBQVUsR0FBRyw2QkFBcUIsSUFBSSxVQUFVLEdBQUcsNkJBQXFCLEVBQUU7UUFDN0UsTUFBTSxJQUFJLDJCQUFtQixDQUFDLGtDQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUNyQixrREFBa0Q7WUFDakQsNkJBQXFCO1lBQ3JCLE9BQU87WUFDUCw2QkFBcUIsQ0FDdEI7YUFDQSxLQUFLLEVBQUUsQ0FBQztLQUNWO0FBQ0YsQ0FBQztBQVhELDBFQVdDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQiwwQkFBMEIsQ0FBQyxXQUEwQjtJQUNwRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGFBQUssRUFBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsc0JBQWMsQ0FBQyxHQUFHLDZCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRS9GLE9BQU87UUFDTixVQUFVO0tBQ1YsQ0FBQztBQUNILENBQUM7QUFORCxnRUFNQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IseUJBQXlCLENBQUMsT0FBc0I7SUFDL0QsTUFBTSxVQUFVLEdBQUcsSUFBQSxhQUFLLEVBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLDZCQUFxQixDQUFDLEdBQUcsc0JBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUzRixPQUFPO1FBQ04sVUFBVTtLQUNWLENBQUM7QUFDSCxDQUFDO0FBTkQsOERBTUMifQ==