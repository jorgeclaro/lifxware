export declare const HSBK_MINIMUM_RAW = 0;
export declare const HSBK_MAXIMUM_RAW = 65535;
export declare const HSBK_MINIMUM_KELVIN = 1500;
export declare const HSBK_DEFAULT_KELVIN = 3500;
export declare const HSBK_MAXIMUM_KELVIN = 9000;
export declare const HSBK_MINIMUM_BRIGHTNESS = 0;
export declare const HSBK_MAXIMUM_BRIGHTNESS = 100;
export declare const HSBK_MINIMUM_SATURATION = 0;
export declare const HSBK_MAXIMUM_SATURATION = 100;
export declare const HSBK_MINIMUM_HUE = 0;
export declare const HSBK_MAXIMUM_HUE = 360;
export interface ColorHSB {
    hue: number;
    saturation: number;
    brightness: number;
}
export interface ColorHSBK extends ColorHSB {
    kelvin: number;
}
export interface ColorHSBKRequest {
    stream?: number;
    color: ColorHSBK;
    duration: number;
}
/**
 * Converts an object with hue,saturation,brightness,kelvin integer packet values to an
 * hsbk normalised integer object
 * @param packetColor object with hue,saturation,brightness,kelvin keys and values
 * @return hsvkColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export declare function packetToNormalisedHSBK(packetColor: ColorHSBK): ColorHSBK;
/**
 * Converts an object with hue,saturation,brightness,kelvin integer normalised values to an
 * hsbk packet integer object
 * @param hsbkColor object with hue,saturation,brightness,kelvin keys and values
 * @return packetColor object with hue,saturation,brightness,kelvin keys and converted values
 */
export declare function normalisedToPacketHBSK(hsbkColor: ColorHSBK): ColorHSBK;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 */
export declare function validateNormalisedColorHSB(hue: number, saturation: number, brightness: number): void;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 * @param kelvin temperature to validate
 */
export declare function validateNormalisedColorHSBK(hue: number, saturation: number, brightness: number, kelvin: number): void;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 */
export declare function validateRawColorHSB(hue: number, saturation: number, brightness: number): void;
/**
 * Checks validity of given color hue, saturation and brightness values
 * @param hue value to validate
 * @param saturation value to validate
 * @param brightness brightness value to validate
 * @param kelvin temperature to validate
 */
export declare function validateRawColorHSBK(hue: number, saturation: number, brightness: number, kelvin: number): void;
//# sourceMappingURL=colorHSBK.d.ts.map