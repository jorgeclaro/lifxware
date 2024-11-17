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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JIU0JLLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3BhY2tldHMvY29sb3IvY29sb3JIU0JLLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV4QyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFDbEMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBRXRDLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUN4QyxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDeEMsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0FBRXhDLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLENBQUM7QUFDM0MsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLEdBQUcsQ0FBQztBQUMzQyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFDbEMsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0FBa0JwQzs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxXQUFzQjtJQUM1RCxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUUsTUFBTSxVQUFVLEdB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