import { RGB_MAXIMUM_VALUE } from '../packets/colorRGBW/colorRGBW';
import { ServiceErrorBuilder } from './error';
import { ER_LIGHT_COLOR_RANGE } from '../errors/lightErrors';
/**
 * Converts an RGB Hex string to an object with decimal representations
 * @example rgbHexStringToObject('#FF00FF')
 * @param rgbHexString hex value to parse, with leading #
 * @return object with decimal values for red, green and blue
 */
export function rgbHexStringToObject(rgbHexString) {
    const hashChar = rgbHexString.substr(0, 1);
    if (hashChar !== '#') {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage(`rgbHexStringToObject expects hex parameter with leading '#' sign`)
            .build();
    }
    const pureHex = rgbHexString.substr(1);
    if (pureHex.length !== 6 && pureHex.length !== 3) {
        throw new ServiceErrorBuilder(ER_LIGHT_COLOR_RANGE)
            .withContextualMessage(`rgbHexStringToObject expects hex value parameter to be 3 or 6 chars long`)
            .build();
    }
    let red;
    let green;
    let blue;
    if (pureHex.length === 6) {
        red = pureHex.substring(0, 2);
        green = pureHex.substring(2, 4);
        blue = pureHex.substring(4, 6);
    }
    else if (pureHex.length === 3) {
        red = pureHex.substring(0, 1);
        red += red;
        green = pureHex.substring(1, 2);
        green += green;
        blue = pureHex.substring(2, 3);
        blue += blue;
    }
    const rgb = {
        red: parseInt(red, 16),
        green: parseInt(green, 16),
        blue: parseInt(blue, 16)
    };
    return rgb;
}
/**
 * Converts an object with r,g,b integer values to an
 * hsb integer object
 * @param rgbObj object with red, green and blue  keys and values
 * @return object with huse, saturation and brightness keys and converted values
 */
export function rgbToHsb(rgbObj) {
    const red = rgbObj.red / RGB_MAXIMUM_VALUE;
    const green = rgbObj.green / RGB_MAXIMUM_VALUE;
    const blue = rgbObj.blue / RGB_MAXIMUM_VALUE;
    const rgb = [red, green, blue];
    const sortedCopy = rgb.slice();
    sortedCopy.sort((a, b) => {
        return a - b;
    });
    const max = sortedCopy[sortedCopy.length - 1];
    sortedCopy.sort((a, b) => {
        return a - b;
    });
    const min = sortedCopy[0];
    const c = max - min;
    /** https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma */
    let hue;
    if (c === 0) {
        hue = 0;
    }
    else if (max === red) {
        hue = (green - blue) / c;
        if (hue < 0) {
            hue += 6;
        }
    }
    else if (max === green) {
        hue = 2 + (blue - red) / c;
    }
    else {
        /** max === blue */
        hue = 4 + (red - green) / c;
    }
    /** https://en.wikipedia.org/wiki/HSL_and_HSV#Lightness */
    const lightness = max;
    /** https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation */
    let saturation;
    if (c === 0) {
        saturation = 0;
    }
    else {
        saturation = c / lightness;
    }
    const hsb = {
        hue: Math.round(60 * hue),
        saturation: Math.round(saturation * 100),
        brightness: Math.round(lightness * 100)
    };
    return hsb;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2NvbG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBWSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUM5QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU3RDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxZQUFvQjtJQUN4RCxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUzQyxJQUFJLFFBQVEsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLElBQUksbUJBQW1CLENBQUMsb0JBQW9CLENBQUM7YUFDakQscUJBQXFCLENBQUMsa0VBQWtFLENBQUM7YUFDekYsS0FBSyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBQ0QsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDbEQsTUFBTSxJQUFJLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDO2FBQ2pELHFCQUFxQixDQUFDLDBFQUEwRSxDQUFDO2FBQ2pHLEtBQUssRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVELElBQUksR0FBRyxDQUFDO0lBQ1IsSUFBSSxLQUFLLENBQUM7SUFDVixJQUFJLElBQUksQ0FBQztJQUVULElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMxQixHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsS0FBSyxH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