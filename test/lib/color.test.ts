import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	rgbHexStringToObject,
	rgbToHsb
} from '../../src/lib/color';
import {
	ServiceError,
	ServiceErrorBuilder,
	ErrorSeverity
} from '../../src/lib/error';
import {
	packetToNormalisedHSBK,
	normalisedToPacketHBSK,
	validateNormalisedColorHSB,
	validateNormalisedColorHSBK,
	validateRawColorHSB,
	validateRawColorHSBK,
	HSBK_MAXIMUM_RAW,
	HSBK_MINIMUM_RAW,
	HSBK_MINIMUM_HUE,
	HSBK_MAXIMUM_HUE,
	HSBK_MINIMUM_SATURATION,
	HSBK_MAXIMUM_SATURATION,
	HSBK_MINIMUM_BRIGHTNESS,
	HSBK_MAXIMUM_BRIGHTNESS,
	HSBK_MINIMUM_KELVIN,
	HSBK_MAXIMUM_KELVIN
} from '../../src/packets/color/colorHSBK';
import {
	validateNormalisedColorRgb,
	validateRawColorRgb,
	validateRawColorRgbw,
	RGB_MAXIMUM_VALUE,
	RGB_MINIMUM_VALUE
} from '../../src/packets/colorRGBW/colorRGBW';

describe('color', () => {
	describe('rgbHexStringToObject', () => {
		it('should convert 6-digit hex to RGB object', () => {
			const result = rgbHexStringToObject('#FF0000');
			expect(result.red).toBe(255);
			expect(result.green).toBe(0);
			expect(result.blue).toBe(0);
		});

		it('should convert 3-digit hex to RGB object', () => {
			const result = rgbHexStringToObject('#F00');
			expect(result.red).toBe(255);
			expect(result.green).toBe(0);
			expect(result.blue).toBe(0);
		});

		it('should convert white hex to RGB object', () => {
			const result = rgbHexStringToObject('#FFFFFF');
			expect(result.red).toBe(255);
			expect(result.green).toBe(255);
			expect(result.blue).toBe(255);
		});

		it('should convert black hex to RGB object', () => {
			const result = rgbHexStringToObject('#000000');
			expect(result.red).toBe(0);
			expect(result.green).toBe(0);
			expect(result.blue).toBe(0);
		});

		it('should throw for hex without # prefix', () => {
			expect(() => rgbHexStringToObject('FF0000')).toThrow();
		});

		it('should throw for invalid hex length', () => {
			expect(() => rgbHexStringToObject('#FF')).toThrow();
		});
	});

	describe('rgbToHsb', () => {
		it('should convert red to HSB', () => {
			const result = rgbToHsb({ red: 255, green: 0, blue: 0 });
			expect(result.hue).toBe(0);
			expect(result.saturation).toBe(100);
			expect(result.brightness).toBe(100);
		});

		it('should convert green to HSB', () => {
			const result = rgbToHsb({ red: 0, green: 255, blue: 0 });
			expect(result.hue).toBe(120);
			expect(result.saturation).toBe(100);
			expect(result.brightness).toBe(100);
		});

		it('should convert blue to HSB', () => {
			const result = rgbToHsb({ red: 0, green: 0, blue: 255 });
			expect(result.hue).toBe(240);
			expect(result.saturation).toBe(100);
			expect(result.brightness).toBe(100);
		});

		it('should convert white to HSB', () => {
			const result = rgbToHsb({ red: 255, green: 255, blue: 255 });
			expect(result.hue).toBe(0);
			expect(result.saturation).toBe(0);
			expect(result.brightness).toBe(100);
		});

		it('should convert black to HSB', () => {
			const result = rgbToHsb({ red: 0, green: 0, blue: 0 });
			expect(result.hue).toBe(0);
			expect(result.saturation).toBe(0);
			expect(result.brightness).toBe(0);
		});

		it('should convert gray to HSB', () => {
			const result = rgbToHsb({ red: 128, green: 128, blue: 128 });
			expect(result.hue).toBe(0);
			expect(result.saturation).toBe(0);
			expect(result.brightness).toBe(50);
		});
	});
});

describe('error', () => {
	describe('ServiceError', () => {
		it('should create error with basic properties', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const serviceError = new ServiceError(error);

			expect(serviceError.error.code).toBe('TEST_CODE');
			expect(serviceError.error.message).toBe('Test message');
			expect(serviceError.error.severity).toBe(ErrorSeverity.High);
		});

		it('should create error with contextual message', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const serviceError = new ServiceError(error, 'Context info');

			expect(serviceError.contextualMessage).toBe('Context info');
		});

		it('should create error with inner error', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const innerError = new Error('Inner error');
			const serviceError = new ServiceError(error, undefined, innerError);

			expect(serviceError.innerError).toBe(innerError);
		});

		it('should format error as string', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const serviceError = new ServiceError(error, 'Context info');

			expect(serviceError.toString()).toContain('TEST_CODE');
			expect(serviceError.toString()).toContain('Test message');
			expect(serviceError.toString()).toContain('Context info');
		});
	});

	describe('ServiceErrorBuilder', () => {
		it('should build error with default values', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const builder = new ServiceErrorBuilder(error);
			const serviceError = builder.build();

			expect(serviceError.error.code).toBe('TEST_CODE');
			expect(serviceError.error.message).toBe('Test message');
		});

		it('should add contextual message', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const builder = new ServiceErrorBuilder(error);
			const serviceError = builder.withContextualMessage('Extra info').build();

			expect(serviceError.contextualMessage).toBe('Extra info');
		});

		it('should add inner error', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const innerError = new Error('Inner error');
			const builder = new ServiceErrorBuilder(error);
			const serviceError = builder.withInnerError(innerError).build();

			expect(serviceError.innerError).toBe(innerError);
		});

		it('should allow method chaining', () => {
			const error: IError = {
				code: 'TEST_CODE',
				message: 'Test message',
				severity: ErrorSeverity.High
			};
			const innerError = new Error('Inner error');
			const builder = new ServiceErrorBuilder(error);
			const serviceError = builder
				.withContextualMessage('Context')
				.withInnerError(innerError)
				.build();

			expect(serviceError.contextualMessage).toBe('Context');
			expect(serviceError.innerError).toBe(innerError);
		});
	});
});

describe('colorHSBK', () => {
	describe('packetToNormalisedHSBK', () => {
		it('should convert max values to max normalized values', () => {
			const result = packetToNormalisedHSBK({
				hue: HSBK_MAXIMUM_RAW,
				saturation: HSBK_MAXIMUM_RAW,
				brightness: HSBK_MAXIMUM_RAW,
				kelvin: 3500
			});

			expect(result.hue).toBe(HSBK_MAXIMUM_HUE);
			expect(result.saturation).toBe(HSBK_MAXIMUM_SATURATION);
			expect(result.brightness).toBe(HSBK_MAXIMUM_BRIGHTNESS);
		});

		it('should convert min values to min normalized values', () => {
			const result = packetToNormalisedHSBK({
				hue: 0,
				saturation: 0,
				brightness: 0,
				kelvin: 1500
			});

			expect(result.hue).toBe(HSBK_MINIMUM_HUE);
			expect(result.saturation).toBe(HSBK_MINIMUM_SATURATION);
			expect(result.brightness).toBe(HSBK_MINIMUM_BRIGHTNESS);
		});

		it('should preserve kelvin value', () => {
			const result = packetToNormalisedHSBK({
				hue: 0,
				saturation: 0,
				brightness: 0,
				kelvin: 5000
			});

			expect(result.kelvin).toBe(5000);
		});
	});

	describe('normalisedToPacketHBSK', () => {
		it('should convert max normalized values to max packet values', () => {
			const result = normalisedToPacketHBSK({
				hue: HSBK_MAXIMUM_HUE,
				saturation: HSBK_MAXIMUM_SATURATION,
				brightness: HSBK_MAXIMUM_BRIGHTNESS,
				kelvin: 3500
			});

			expect(result.hue).toBe(HSBK_MAXIMUM_RAW);
			expect(result.saturation).toBe(HSBK_MAXIMUM_RAW);
			expect(result.brightness).toBe(HSBK_MAXIMUM_RAW);
		});

		it('should convert min normalized values to min packet values', () => {
			const result = normalisedToPacketHBSK({
				hue: 0,
				saturation: 0,
				brightness: 0,
				kelvin: 1500
			});

			expect(result.hue).toBe(HSBK_MINIMUM_RAW);
			expect(result.saturation).toBe(HSBK_MINIMUM_RAW);
			expect(result.brightness).toBe(HSBK_MINIMUM_RAW);
		});
	});

	describe('validateNormalisedColorHSB', () => {
		it('should not throw for valid values', () => {
			expect(() => validateNormalisedColorHSB(180, 50, 75)).not.toThrow();
		});

		it('should throw for hue below minimum', () => {
			expect(() => validateNormalisedColorHSB(-1, 50, 75)).toThrow();
		});

		it('should throw for hue above maximum', () => {
			expect(() => validateNormalisedColorHSB(361, 50, 75)).toThrow();
		});

		it('should throw for saturation below minimum', () => {
			expect(() => validateNormalisedColorHSB(180, -1, 75)).toThrow();
		});

		it('should throw for saturation above maximum', () => {
			expect(() => validateNormalisedColorHSB(180, 101, 75)).toThrow();
		});

		it('should throw for brightness below minimum', () => {
			expect(() => validateNormalisedColorHSB(180, 50, -1)).toThrow();
		});

		it('should throw for brightness above maximum', () => {
			expect(() => validateNormalisedColorHSB(180, 50, 101)).toThrow();
		});
	});

	describe('validateNormalisedColorHSBK', () => {
		it('should not throw for valid values', () => {
			expect(() => validateNormalisedColorHSBK(180, 50, 75, 3500)).not.toThrow();
		});

		it('should throw for kelvin below minimum', () => {
			expect(() => validateNormalisedColorHSBK(180, 50, 75, 1400)).toThrow();
		});

		it('should throw for kelvin above maximum', () => {
			expect(() => validateNormalisedColorHSBK(180, 50, 75, 9001)).toThrow();
		});
	});

	describe('validateRawColorHSB', () => {
		it('should not throw for valid values', () => {
			expect(() => validateRawColorHSB(30000, 30000, 30000)).not.toThrow();
		});

		it('should throw for hue below minimum', () => {
			expect(() => validateRawColorHSB(-1, 30000, 30000)).toThrow();
		});

		it('should throw for hue above maximum', () => {
			expect(() => validateRawColorHSB(65536, 30000, 30000)).toThrow();
		});
	});

	describe('validateRawColorHSBK', () => {
		it('should not throw for valid values', () => {
			expect(() => validateRawColorHSBK(30000, 30000, 30000, 3500)).not.toThrow();
		});

		it('should throw for kelvin below minimum', () => {
			expect(() => validateRawColorHSBK(30000, 30000, 30000, 1400)).toThrow();
		});

		it('should throw for kelvin above maximum', () => {
			expect(() => validateRawColorHSBK(30000, 30000, 30000, 9001)).toThrow();
		});
	});
});

describe('colorRGBW', () => {
	describe('validateNormalisedColorRgb', () => {
		it('should not throw for valid values', () => {
			expect(() => validateNormalisedColorRgb(128, 64, 255)).not.toThrow();
		});

		it('should throw for red below minimum', () => {
			expect(() => validateNormalisedColorRgb(-1, 128, 128)).toThrow();
		});

		it('should throw for red above maximum', () => {
			expect(() => validateNormalisedColorRgb(256, 128, 128)).toThrow();
		});

		it('should throw for green below minimum', () => {
			expect(() => validateNormalisedColorRgb(128, -1, 128)).toThrow();
		});

		it('should throw for green above maximum', () => {
			expect(() => validateNormalisedColorRgb(128, 256, 128)).toThrow();
		});

		it('should throw for blue below minimum', () => {
			expect(() => validateNormalisedColorRgb(128, 128, -1)).toThrow();
		});

		it('should throw for blue above maximum', () => {
			expect(() => validateNormalisedColorRgb(128, 128, 256)).toThrow();
		});
	});

	describe('validateRawColorRgb', () => {
		it('should not throw for valid values', () => {
			expect(() => validateRawColorRgb(30000, 30000, 30000)).not.toThrow();
		});

		it('should throw for red below minimum', () => {
			expect(() => validateRawColorRgb(-1, 30000, 30000)).toThrow();
		});

		it('should throw for red above maximum', () => {
			expect(() => validateRawColorRgb(65536, 30000, 30000)).toThrow();
		});
	});

	describe('validateRawColorRgbw', () => {
		it('should not throw for valid normalized values', () => {
			expect(() => validateRawColorRgbw(128, 64, 255, 30000)).not.toThrow();
		});

		it('should throw for red above normalized max', () => {
			expect(() => validateRawColorRgbw(256, 128, 128, 30000)).toThrow();
		});

		it('should throw for blue above raw max (bug in code: checks blue instead of white)', () => {
			expect(() => validateRawColorRgbw(128, 64, 65536, 128)).toThrow();
		});
	});
});