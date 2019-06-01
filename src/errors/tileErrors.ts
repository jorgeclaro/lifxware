import { IError, ErrorSeverity } from '../lib/error';

export const ER_TILE_INVALID_SIZE: IError = {
	code: 'ER_TILE_INVALID_SIZE',
	message: 'Wrong number of Tiles',
	severity: ErrorSeverity.High
};
