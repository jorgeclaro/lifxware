"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRawColorHSBK = exports.validateRawColorHSB = exports.validateNormalisedColorHSBK = exports.validateNormalisedColorHSB = exports.normalisedToPacketHBSK = exports.packetToNormalisedHSBK = exports.HSBK_MAXIMUM_HUE = exports.HSBK_MINIMUM_HUE = exports.HSBK_MAXIMUM_SATURATION = exports.HSBK_MINIMUM_SATURATION = exports.HSBK_MAXIMUM_BRIGHTNESS = exports.HSBK_MINIMUM_BRIGHTNESS = exports.HSBK_MAXIMUM_KELVIN = exports.HSBK_DEFAULT_KELVIN = exports.HSBK_MINIMUM_KELVIN = exports.HSBK_MAXIMUM_RAW = exports.HSBK_MINIMUM_RAW = void 0;
const error_1 = require("../../lib/error");
const lightErrors_1 = require("../../errors/lightErrors");
const utils_1 = require("../../lib/utils");
exports.HSBK_MINIMUM_RAW = 0;
exports.HSBK_MAXIMUM_RAW = 65535;
exports.HSBK_MINIMUM_KELVIN = 1500;
exports.HSBK_DEFAULT_KELVIN = 3500;
exports.HSBK_MAXIMUM_KELVIN = 9000;
exports.HSBK_MINIMUM_BRIGHTNESS = 0;
exports.HSBK_MAXIMUM_BRIGHTNESS = 100;
exports.HSBK_MINIMUM_SATURATION = 0;
exports.HSBK_MAXIMUM_SATURATION = 100;
exports.HSBK_MINIMUM_HUE = 0;
exports.HSBK_MAXIMUM_HUE = 360;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
function packetToNormalisedHSBK(packetColor) {
    const hue = (0, utils_1.round)((packetColor.hue / exports.HSBK_MAXIMUM_RAW) * exports.HSBK_MAXIMUM_HUE, 2);
    const saturation = (0, utils_1.round)((packetColor.saturation / exports.HSBK_MAXIMUM_RAW) * exports.HSBK_MAXIMUM_SATURATION, 2);
    const brightness = (0, utils_1.round)((packetColor.brightness / exports.HSBK_MAXIMUM_RAW) * exports.HSBK_MAXIMUM_BRIGHTNESS, 2);
    return {
        hue: hue,
        saturation: saturation,
        brightness: brightness,
        kelvin: packetColor.kelvin
    };
}
exports.packetToNormalisedHSBK = packetToNormalisedHSBK;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param hsbkColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
function normalisedToPacketHBSK(hsbkColor) {
    const hue = (0, utils_1.round)((hsbkColor.hue / exports.HSBK_MAXIMUM_HUE) * exports.HSBK_MAXIMUM_RAW, 0);
    const saturation = (0, utils_1.round)((hsbkColor.saturation / exports.HSBK_MAXIMUM_SATURATION) * exports.HSBK_MAXIMUM_RAW, 0);
    const brightness = (0, utils_1.round)((hsbkColor.brightness / exports.HSBK_MAXIMUM_BRIGHTNESS) * exports.HSBK_MAXIMUM_RAW, 0);
    return {
        hue,
        saturation,
        brightness,
        kelvin: hsbkColor.kelvin
    };
}
exports.normalisedToPacketHBSK = normalisedToPacketHBSK;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 */
function validateNormalisedColorHSB(hue, saturation, brightness) {
    if (hue < exports.HSBK_MINIMUM_HUE || hue > exports.HSBK_MAXIMUM_HUE) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects hue to be a number between ' + exports.HSBK_MINIMUM_HUE + ' and ' + exports.HSBK_MAXIMUM_HUE)
            .build();
    }
    if (saturation < exports.HSBK_MINIMUM_SATURATION || saturation > exports.HSBK_MAXIMUM_SATURATION) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects saturation to be a number between ' +
            exports.HSBK_MINIMUM_SATURATION +
            ' and ' +
            exports.HSBK_MAXIMUM_SATURATION)
            .build();
    }
    if (brightness < exports.HSBK_MINIMUM_BRIGHTNESS || brightness > exports.HSBK_MAXIMUM_BRIGHTNESS) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' +
            exports.HSBK_MINIMUM_BRIGHTNESS +
            ' and ' +
            exports.HSBK_MAXIMUM_BRIGHTNESS)
            .build();
    }
}
exports.validateNormalisedColorHSB = validateNormalisedColorHSB;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 * @param kelvin temperature to validate
 */
function validateNormalisedColorHSBK(hue, saturation, brightness, kelvin) {
    validateNormalisedColorHSB(hue, saturation, brightness);
    if (kelvin < exports.HSBK_MINIMUM_KELVIN || kelvin > exports.HSBK_MAXIMUM_KELVIN) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects kelvin to be a number between ' + exports.HSBK_MINIMUM_KELVIN + ' and ' + exports.HSBK_MAXIMUM_KELVIN)
            .build();
    }
}
exports.validateNormalisedColorHSBK = validateNormalisedColorHSBK;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 */
function validateRawColorHSB(hue, saturation, brightness) {
    if (hue < exports.HSBK_MINIMUM_RAW || hue > exports.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects hue to be a number between ' + exports.HSBK_MINIMUM_RAW + ' and ' + exports.HSBK_MAXIMUM_RAW)
            .build();
    }
    if (saturation < exports.HSBK_MINIMUM_RAW || saturation > exports.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects saturation to be a number between ' + exports.HSBK_MINIMUM_RAW + ' and ' + exports.HSBK_MAXIMUM_RAW)
            .build();
    }
    if (brightness < exports.HSBK_MINIMUM_RAW || brightness > exports.HSBK_MAXIMUM_RAW) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + exports.HSBK_MINIMUM_RAW + ' and ' + exports.HSBK_MAXIMUM_RAW)
            .build();
    }
}
exports.validateRawColorHSB = validateRawColorHSB;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 * @param kelvin temperature to validate
 */
function validateRawColorHSBK(hue, saturation, brightness, kelvin) {
    validateRawColorHSB(hue, saturation, brightness);
    if (kelvin < exports.HSBK_MINIMUM_KELVIN || kelvin > exports.HSBK_MAXIMUM_KELVIN) {
        throw new error_1.ServiceErrorBuilder(lightErrors_1.ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects kelvin to be a number between ' + exports.HSBK_MINIMUM_KELVIN + ' and ' + exports.HSBK_MAXIMUM_KELVIN)
            .build();
    }
}
exports.validateRawColorHSBK = validateRawColorHSBK;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JIU0JLLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3IvY29sb3JIU0JLLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFzRDtBQUN0RCwwREFBZ0U7QUFDaEUsMkNBQXdDO0FBRTNCLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFFBQUEsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBRXpCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBRTNCLFFBQUEsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFFBQUEsdUJBQXVCLEdBQUcsR0FBRyxDQUFDO0FBQzlCLFFBQUEsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFFBQUEsdUJBQXVCLEdBQUcsR0FBRyxDQUFDO0FBQzlCLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFFBQUEsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0FBa0JwQzs7Ozs7R0FLRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLFdBQXNCO0lBQzVELE1BQU0sR0FBRyxHQUFHLElBQUEsYUFBSyxFQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRyx3QkFBZ0IsQ0FBQyxHQUFHLHdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlFLE1BQU0sVUFBVSxHQUFHLElBQUEsYUFBSyxFQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyx3QkFBZ0IsQ0FBQyxHQUFHLCtCQUF1QixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25HLE1BQU0sVUFBVSxHQUFHLElBQUEsYUFBSyxFQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyx3QkFBZ0IsQ0FBQyxHQUFHLCtCQUF1QixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRW5HLE9B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