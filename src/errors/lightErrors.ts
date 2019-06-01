import { IError, ErrorSeverity } from '../lib/error';

export const ER_LIGHT_OFFLINE: IError = {
	code: 'ER_LIGHT_OFFLINE',
	message: 'Light is offline',
	severity: ErrorSeverity.High
};

export const ER_LIGHT_CMD_NOT_SUPPORTED: IError = {
	code: 'ER_LIGHT_CMD_NOT_SUPPORTED',
	message: 'Command not supported',
	severity: ErrorSeverity.High
};

export const ER_LIGHT_CMD_TIMEOUT: IError = {
	code: 'ER_LIGHT_CMD_TIMEOUT',
	message: 'Timeout',
	severity: ErrorSeverity.High
};

export const ER_LIGHT_COLOR_RANGE: IError = {
	code: 'ER_LIGHT_COLOR_RANGE',
	message: 'Color values out of range',
	severity: ErrorSeverity.High
};

export const ER_LIGHT_MISSING_CACHE: IError = {
	code: 'ER_LIGHT_MISSING_CACHE',
	message: 'Cache of color values is missing',
	severity: ErrorSeverity.High
};
