export enum LightLastHevCycleResult {
	SUCCESS = 0,
	BUSY = 1,
	INTERRUPTED_BY_RESET = 2,
	INTERRUPTED_BY_HOMEKIT = 3,
	INTERRUPTED_BY_LAN = 4,
	INTERRUPTED_BY_CLOUD = 5,
	NONE = 255
}

export interface LightHevCycleRequest {
	enable: boolean;
	durationS: number;
}

export interface LightHevCycleState {
	durationS: number;
	remainingS: number;
	lastPower: boolean;
}

export interface LightHevCycleConfiguration {
	indication: boolean;
	durationS: number;
}

export interface LightHevCycleResult {
	result: LightLastHevCycleResult;
}
