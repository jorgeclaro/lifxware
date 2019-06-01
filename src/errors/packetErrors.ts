import { IError, ErrorSeverity } from '../lib/error';

export const ER_PACKET_UNKNOWN: IError = {
	code: 'ER_PACKET_UNKNOWN',
	message: 'Unknown packet',
	severity: ErrorSeverity.High
};

export const ER_PACKET_INVALID_SIZE: IError = {
	code: 'ER_PACKET_INVALID_SIZE',
	message: 'Invalid packet size',
	severity: ErrorSeverity.High
};
