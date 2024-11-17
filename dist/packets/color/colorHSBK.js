import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
import { round } from '../../lib/utils';
export const HSBK_MINIMUM_RAW = 0;
export const HSBK_MAXIMUM_RAW = 65535;
export const HSBK_MINIMUM_KELVIN = 1500;
export const HSBK_DEFAULT_KELVIN = 3500;
export const HSBK_MAXIMUM_KELVIN = 9000;
export const HSBK_MINIMUM_BRIGHTNESS = 0;
export const HSBK_MAXIMUM_BRIGHTNESS = 100;
export const HSBK_MINIMUM_SATURATION = 0;
export const HSBK_MAXIMUM_SATURATION = 100;
export const HSBK_MINIMUM_HUE = 0;
export const HSBK_MAXIMUM_HUE = 360;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export function packetToNormalisedHSBK(packetColor) {
    const hue = round((packetColor.hue / HSBK_MAXIMUM_RAW) * HSBK_MAXIMUM_HUE, 2);
    const saturation = round((packetColor.saturation / HSBK_MAXIMUM_RAW) * HSBK_MAXIMUM_SATURATION, 2);
    const brightness = round((packetColor.brightness / HSBK_MAXIMUM_RAW) * HSBK_MAXIMUM_BRIGHTNESS, 2);
    return {
        hue: hue,
        saturation: saturation,
        brightness: brightness,
        kelvin: packetColor.kelvin
    };
}
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param hsbkColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export function normalisedToPacketHBSK(hsbkColor) {
    const hue = round((hsbkColor.hue / HSBK_MAXIMUM_HUE) * HSBK_MAXIMUM_RAW, 0);
    const saturation = round((hsbkColor.saturation / HSBK_MAXIMUM_SATURATION) * HSBK_MAXIMUM_RAW, 0);
    const brightness = round((hsbkColor.brightness / HSBK_MAXIMUM_BRIGHTNESS) * HSBK_MAXIMUM_RAW, 0);
    return {
        hue,
        saturation,
        brightness,
        kelvin: hsbkColor.kelvin
    };
}
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 */
export function validateNormalisedColorHSB(hue, saturation, brightness) {
    if (hue < HSBK_MINIMUM_HUE || hue > HSBK_MAXIMUM_HUE) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects hue to be a number between ' + HSBK_MINIMUM_HUE + ' and ' + HSBK_MAXIMUM_HUE)
            .build();
    }
    if (saturation < HSBK_MINIMUM_SATURATION || saturation > HSBK_MAXIMUM_SATURATION) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects saturation to be a number between ' +
            HSBK_MINIMUM_SATURATION +
            ' and ' +
            HSBK_MAXIMUM_SATURATION)
            .build();
    }
    if (brightness < HSBK_MINIMUM_BRIGHTNESS || brightness > HSBK_MAXIMUM_BRIGHTNESS) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' +
            HSBK_MINIMUM_BRIGHTNESS +
            ' and ' +
            HSBK_MAXIMUM_BRIGHTNESS)
            .build();
    }
}
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 * @param kelvin temperature to validate
 */
export function validateNormalisedColorHSBK(hue, saturation, brightness, kelvin) {
    validateNormalisedColorHSB(hue, saturation, brightness);
    if (kelvin < HSBK_MINIMUM_KELVIN || kelvin > HSBK_MAXIMUM_KELVIN) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects kelvin to be a number between ' + HSBK_MINIMUM_KELVIN + ' and ' + HSBK_MAXIMUM_KELVIN)
            .build();
    }
}
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 */
export function validateRawColorHSB(hue, saturation, brightness) {
    if (hue < HSBK_MINIMUM_RAW || hue > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects hue to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    if (saturation < HSBK_MINIMUM_RAW || saturation > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects saturation to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
    if (brightness < HSBK_MINIMUM_RAW || brightness > HSBK_MAXIMUM_RAW) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' + HSBK_MINIMUM_RAW + ' and ' + HSBK_MAXIMUM_RAW)
            .build();
    }
}
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 * @param kelvin temperature to validate
 */
export function validateRawColorHSBK(hue, saturation, brightness, kelvin) {
    validateRawColorHSB(hue, saturation, brightness);
    if (kelvin < HSBK_MINIMUM_KELVIN || kelvin > HSBK_MAXIMUM_KELVIN) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects kelvin to be a number between ' + HSBK_MINIMUM_KELVIN + ' and ' + HSBK_MAXIMUM_KELVIN)
            .build();
    }
}
//# sourceMappingURL=colorHSBK.js.map