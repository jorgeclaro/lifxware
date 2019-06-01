import { IError, ErrorSeverity } from '../lib/error';

export const ER_CLIENT_SOCKET_ERROR: IError = {
	code: 'ER_CLIENT_SOCKET_ERROR',
	message: 'Socket error',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_SOCKET_PORT_RANGE: IError = {
	code: 'ER_CLIENT_SOCKET_PORT_RANGE',
	message: 'Port number out of range',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_SOCKET_IP_PROTOCOL: IError = {
	code: 'ER_CLIENT_SOCKET_IP_PROTOCOL',
	message: 'Invalid IP protocol version',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_SOCKET_UNBOUND: IError = {
	code: 'ER_CLIENT_SOCKET_UNBOUND',
	message: 'Socket unbound',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_MESSAGE_PROCESS: IError = {
	code: 'ER_CLIENT_MESSAGE_PROCESS',
	message: 'Failed to process message',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_NO_RESPONSE: IError = {
	code: 'ER_CLIENT_NO_RESPONSE',
	message: 'No response from light',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_INVALID_CONFIG: IError = {
	code: 'ER_CLIENT_INVALID_CONFIG',
	message: 'Invalid client configuration',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_INVALID_ARGUMENT: IError = {
	code: 'ER_CLIENT_INVALID_ARGUMENT',
	message: 'Invalid argument',
	severity: ErrorSeverity.High
};

export const ER_CLIENT_LIGHT_NOT_FOUND: IError = {
	code: 'ER_CLIENT_LIGHT_NOT_FOUND',
	message: 'Light not found',
	severity: ErrorSeverity.High
};
