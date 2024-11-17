import { round } from '../../lib/utils';
import { ServiceErrorBuilder } from '../../lib/error';
import { ER_LIGHT_COLOR_RANGE } from '../../errors/lightErrors';
export const IR_MINIMUM_RAW = 0;
export const IR_MAXIMUM_RAW = 65535;
export const IR_MINIMUM_BRIGHTNESS = 0;
export const IR_MAXIMUM_BRIGHTNESS = 100;
/**
 * Checks validity of IR brightness
 * @param brightness IR brightness to validate
 */
export function validateNormalisedColorInfrared(brightness) {
    if (brightness < IR_MINIMUM_BRIGHTNESS || brightness > IR_MAXIMUM_BRIGHTNESS) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage('Light expects brightness to be a number between ' +
            IR_MINIMUM_BRIGHTNESS +
            ' and ' +
            IR_MAXIMUM_BRIGHTNESS)
            .build();
    }
}
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param {Object} packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return {Object} hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export function packetToNormalisedInfrared(packetColor) {
    const brightness = round((packetColor.brightness / IR_MAXIMUM_RAW) * IR_MAXIMUM_BRIGHTNESS, 2);
    return {
        brightness
    };
}
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param irColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export function normalisedToPacketInfraed(irColor) {
    const brightness = round((irColor.brightness / IR_MAXIMUM_BRIGHTNESS) * IR_MAXIMUM_RAW, 0);
    return {
        brightness
    };
}
//# sourceMappingURL=colorInfrared.js.map