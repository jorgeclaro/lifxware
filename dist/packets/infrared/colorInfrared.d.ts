export declare const IR_MINIMUM_RAW = 0;
export declare const IR_MAXIMUM_RAW = 65535;
export declare const IR_MINIMUM_BRIGHTNESS = 0;
export declare const IR_MAXIMUM_BRIGHTNESS = 100;
export interface ColorInfrared {
    brightness: number;
}
export interface ColorInfraredRequest {
    brightness: number;
}
/**
 * Checks validity of IR brightness
 * @param brightness IR brightness to validate
 */
export declare function validateNormalisedColorInfrared(brightness: number): void;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param {Object} packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return {Object} hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export declare function packetToNormalisedInfrared(packetColor: ColorInfrared): ColorInfrared;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param irColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export declare function normalisedToPacketInfraed(irColor: ColorInfrared): ColorInfrared;
//# sourceMappingURL=colorInfrared.d.ts.map