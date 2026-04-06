import { describe, it, expect } from 'vitest';
import {
	PACKET_HEADER_SIZE,
	PACKET_HEADER_SEQUENCE_MAX,
	PACKET_DEFAULT_SORUCE,
	PROTOCOL_VERSION_CURRENT,
	PROTOCOL_VERSION_LEGACY,
	createObject,
	getPacketBodyHandlerByType,
	getPacketBodyHandlerByName
} from '../../src/lib/packet';
import { packet } from '../../src/packets/packets';

describe('packet', () => {
	describe('constants', () => {
		it('should have correct PACKET_HEADER_SIZE', () => {
			expect(PACKET_HEADER_SIZE).toBe(36);
		});

		it('should have correct PACKET_HEADER_SEQUENCE_MAX', () => {
			expect(PACKET_HEADER_SEQUENCE_MAX).toBe(255);
		});

		it('should have correct PACKET_DEFAULT_SORUCE', () => {
			expect(PACKET_DEFAULT_SORUCE).toBe('00000000');
		});

		it('should have correct protocol versions', () => {
			expect(PROTOCOL_VERSION_CURRENT).toBe(1024);
			expect(PROTOCOL_VERSION_LEGACY).toBe(13312);
		});
	});

	describe('createObject', () => {
		it('should create packet object with correct properties', () => {
			const result = createObject(packet.getService.type, {}, '12345678', 'aabbccddeeff');

			expect(result.type).toBe(packet.getService.type);
			expect(result.source).toBe('12345678');
			expect(result.target).toBe('aabbccddeeff');
			expect(result.size).toBe(PACKET_HEADER_SIZE + packet.getService.size);
		});

		it('should set tagged based on packet handler', () => {
			const result = createObject(packet.getService.type, {});

			expect(result.tagged).toBe(packet.getService.tagged);
		});

		it('should create object without optional params', () => {
			const result = createObject(packet.getService.type, {});

			expect(result.type).toBe(packet.getService.type);
			expect(result.size).toBe(PACKET_HEADER_SIZE + packet.getService.size);
		});
	});

	describe('getPacketBodyHandlerByType', () => {
		it('should return handler for getService type', () => {
			const handler = getPacketBodyHandlerByType(packet.getService.type);

			expect(handler.name).toBe(packet.getService.name);
		});

		it('should return handler for setColor type', () => {
			const handler = getPacketBodyHandlerByType(packet.setColor.type);

			expect(handler.name).toBe(packet.setColor.name);
		});

		it('should return handler for setPower type', () => {
			const handler = getPacketBodyHandlerByType(packet.setPower.type);

			expect(handler.name).toBe(packet.setPower.name);
		});

		it('should throw for unknown type', () => {
			expect(() => getPacketBodyHandlerByType(99999)).toThrow();
		});
	});

	describe('getPacketBodyHandlerByName', () => {
		it('should return handler for getService name', () => {
			const handler = getPacketBodyHandlerByName(packet.getService.name);

			expect(handler.type).toBe(packet.getService.type);
		});

		it('should return handler for setColor name', () => {
			const handler = getPacketBodyHandlerByName(packet.setColor.name);

			expect(handler.type).toBe(packet.setColor.type);
		});

		it('should return handler for statePower name', () => {
			const handler = getPacketBodyHandlerByName(packet.statePower.name);

			expect(handler.type).toBe(packet.statePower.type);
		});

		it('should throw for unknown name', () => {
			expect(() => getPacketBodyHandlerByName('InvalidPacket')).toThrow();
		});
	});
});