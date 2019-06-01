import { ColorHSB } from '../packets/color/colorHSBK';
import { ColorRGB, RGB_MAXIMUM_VALUE } from '../packets/colorRGBW/colorRGBW';
import { ServiceErrorBuilder } from './error';
import { ER_LIGHT_COLOR_RANGE } from '../errors/lightErrors';

/**
 * Converts an RGB Hex string to an object with decimal representations
 * @example rgbHexStringToObject('#FF00FF')
 * @param rgbHexString hex value to parse, with leading #
 * @return object with decimal values for red, green and blue
 */
export function rgbHexStringToObject(rgbHexString: string): ColorRGB {
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
	} else if (pureHex.length === 3) {
		red = pureHex.substring(0, 1);
		red += red;
		green = pureHex.substring(1, 2);
		green += green;
		blue = pureHex.substring(2, 3);
		blue += blue;
	}

	const rgb: ColorRGB = {
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
export function rgbToHsb(rgbObj: ColorRGB): ColorHSB {
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
	let hue: number;

	if (c === 0) {
		hue = 0;
	} else if (max === red) {
		hue = (green - blue) / c;
		if (hue < 0) {
			hue += 6;
		}
	} else if (max === green) {
		hue = 2 + (blue - red) / c;
	} else {
		/** max === blue */
		hue = 4 + (red - green) / c;
	}

	/** https://en.wikipedia.org/wiki/HSL_and_HSV#Lightness */
	const lightness = max;
	/** https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation */
	let saturation: number;

	if (c === 0) {
		saturation = 0;
	} else {
		saturation = c / lightness;
	}

	const hsb: ColorHSB = {
		hue: Math.round(60 * hue),
		saturation: Math.round(saturation * 100),
		brightness: Math.round(lightness * 100)
	};

	return hsb;
}
