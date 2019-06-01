export enum Interface {
	SOFT_AP = 1,
	STATION = 2
}

export enum SecurityProtocol {
	OPEN = 1,
	WEP_PSK = 2,
	WPA_TKIP_PSK = 3,
	WPA_AES_PSK = 4,
	WPA2_AES_PSK = 5,
	WPA2_TKIP_PSK = 6,
	WPA2_MIXED_PSK = 7
}

export enum WIFI_STATUS {
	CONNECTING = 0,
	CONNECTED = 1,
	FAILED = 2,
	OFF = 3
}

export interface AccessPoint {
	iface: Interface;
	ssid: string;
	securityProtocol: SecurityProtocol;
	strength: number;
	channel: number;
}

export interface WifiFirmware {
	build: number;
	install: number;
	version: number;
	majorVersion: number;
	minorVersion: number;
}

export interface WifiInfo {
	signal: number;
	tx: number;
	rx: number;
	mcuTemperature: number;
}
