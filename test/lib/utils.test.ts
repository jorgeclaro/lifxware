import { describe, it, expect } from 'vitest';
import { sleep, round, getHostIPs, isIpv4Format, getRandomHexString } from '../../src/lib/utils';

describe('utils', () => {
	describe('sleep', () => {
		it('should resolve after given milliseconds', async () => {
			const start = Date.now();
			await sleep(10);
			const elapsed = Date.now() - start;
			expect(elapsed).toBeGreaterThanOrEqual(9);
		});
	});

	describe('round', () => {
		it('should round to specified decimals', () => {
			expect(round(1.23456, 2)).toBe(1.23);
			expect(round(1.235, 2)).toBe(1.24);
		});

		it('should handle whole numbers', () => {
			expect(round(5, 0)).toBe(5);
		});

		it('should handle zero decimals', () => {
			expect(round(3.14159, 0)).toBe(3);
		});
	});

	describe('getHostIPs', () => {
		it('should return an array of IP addresses', () => {
			const ips = getHostIPs();
			expect(Array.isArray(ips)).toBe(true);
			expect(ips.length).toBeGreaterThan(0);
		});
	});

	describe('isIpv4Format', () => {
		it('should return true for valid IPv4 addresses', () => {
			expect(isIpv4Format('192.168.1.1')).toBe(true);
			expect(isIpv4Format('0.0.0.0')).toBe(true);
			expect(isIpv4Format('255.255.255.255')).toBe(true);
			expect(isIpv4Format('10.0.0.1')).toBe(true);
		});

		it('should return false for invalid IPv4 addresses', () => {
			expect(isIpv4Format('256.1.1.1')).toBe(false);
			expect(isIpv4Format('192.168.1')).toBe(false);
			expect(isIpv4Format('192.168.1.1.1')).toBe(false);
			expect(isIpv4Format('abc.def.ghi.jkl')).toBe(false);
			expect(isIpv4Format('')).toBe(false);
		});
	});

	describe('getRandomHexString', () => {
		it('should return default length of 8 characters', () => {
			const result = getRandomHexString();
			expect(result.length).toBe(8);
		});

		it('should return specified length', () => {
			expect(getRandomHexString(16).length).toBe(16);
			expect(getRandomHexString(4).length).toBe(4);
		});

		it('should only contain hex characters', () => {
			const result = getRandomHexString();
			expect(/^[0-9A-F]+$/.test(result)).toBe(true);
		});
	});
});