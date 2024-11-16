export declare const RGB_MAXIMUM_VALUE = 255;
export declare const RGB_MINIMUM_VALUE = 0;
export interface ColorRGB {
    red: number;
    green: number;
    blue: number;
}
export interface ColorRGBW extends ColorRGB {
    white: number;
}
export interface ColorRGBWRequest {
    color: ColorRGBW;
}
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
export declare function validateNormalisedColorRgb(red: number, green: number, blue: number): void;
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 */
export declare function validateRawColorRgb(red: number, green: number, blue: number): void;
/**
 * Checks validity of color RGB values
 * @param red Red value to validate
 * @param green Green value to validate
 * @param blue Blue value to validate
 * @param white White value to validate
 */
export declare function validateRawColorRgbw(red: number, green: number, blue: number, white: number): void;
//# sourceMappingURL=colorRGBW.d.ts.map