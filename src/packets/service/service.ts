export enum ServiceType {
	UDP = 1,
	TCP = 2,
	RESERVED = 3,
	RESERVED2 = 4
}

export interface Service {
	service: ServiceType;
	port: number;
}
