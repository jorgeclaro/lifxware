import { ColorHSB } from '../packets/color/colorHSBK';
import { ColorRGB } from '../packets/colorRGBW/colorRGBW';
/**
 * Converts an RGB Hex string to an object with decimal representations
 * @example rgbHexStringToObject('#FF00FF')
 * @param rgbHexString hex value to parse, with leading #
 * @return object with decimal values for red, green and blue
 */
export declare function rgbHexStringToObject(rgbHexString: string): ColorRGB;
/**
 * Converts an object with r,g,b integer values to an
 * hsb integer object
 * @param rgbObj object with red, green and blue  keys and values
 * @return object with huse, saturation and brightness keys and converted values
 */
export declare function rgbToHsb(rgbObj: ColorRGB): ColorHSB;
//# sourceMappingURL=color.d.ts.map