export const POWER_MINIMUM_RAW = 0;
export const POWER_MAXIMUM_RAW = 65535;

export interface PowerRequest {
	power: number;
	duration?: number;
}

export interface PowerResponse {
	power: number;
}
