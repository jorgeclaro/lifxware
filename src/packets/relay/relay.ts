export interface RelayPowerRequest {
	relayIndex: number;
}

export interface RelayPowerState {
	relayIndex: number;
	level: number;
}

export const RELAY_INDEX_MIN = 0;
export const RELAY_INDEX_MAX = 255;
