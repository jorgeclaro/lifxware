import { describe, it, expect } from 'vitest';
import { packet } from '../../src/packets/packets';

describe('HEV packets', () => {
	describe('getHevCycle', () => {
		it('should have correct type', () => {
			expect(packet.getHevCycle.type).toBe(142);
		});

		it('should have size 0', () => {
			expect(packet.getHevCycle.size).toBe(0);
		});
	});

	describe('setHevCycle', () => {
		it('should have correct type', () => {
			expect(packet.setHevCycle.type).toBe(143);
		});

		it('should have size 5', () => {
			expect(packet.setHevCycle.size).toBe(5);
		});

		it('should serialize correctly', () => {
			const buf = packet.setHevCycle.toBuffer!({ enable: true, durationS: 300 });
			expect(buf.length).toBe(5);
			expect(buf.readUInt8(0)).toBe(1);
			expect(buf.readUInt32LE(1)).toBe(300);
		});
	});

	describe('stateHevCycle', () => {
		it('should have correct type', () => {
			expect(packet.stateHevCycle.type).toBe(144);
		});

		it('should have size 9', () => {
			expect(packet.stateHevCycle.size).toBe(9);
		});

		it('should deserialize correctly', () => {
			const buf = Buffer.alloc(9);
			buf.writeUInt32LE(600, 0);
			buf.writeUInt32LE(300, 4);
			buf.writeUInt8(1, 8);

			const result = packet.stateHevCycle.toObject!(buf);
			expect(result.durationS).toBe(600);
			expect(result.remainingS).toBe(300);
			expect(result.lastPower).toBe(true);
		});
	});

	describe('getHevCycleConfig', () => {
		it('should have correct type', () => {
			expect(packet.getHevCycleConfig.type).toBe(145);
		});
	});

	describe('setHevCycleConfig', () => {
		it('should have correct type', () => {
			expect(packet.setHevCycleConfig.type).toBe(146);
		});

		it('should serialize correctly', () => {
			const buf = packet.setHevCycleConfig.toBuffer!({ indication: true, durationS: 600 });
			expect(buf.length).toBe(5);
			expect(buf.readUInt8(0)).toBe(1);
			expect(buf.readUInt32LE(1)).toBe(600);
		});
	});

	describe('stateHevCycleConfig', () => {
		it('should have correct type', () => {
			expect(packet.stateHevCycleConfig.type).toBe(147);
		});
	});

	describe('getLastHevCycleResult', () => {
		it('should have correct type', () => {
			expect(packet.getLastHevCycleResult.type).toBe(148);
		});
	});

	describe('stateLastHevCycleResult', () => {
		it('should have correct type', () => {
			expect(packet.stateLastHevCycleResult.type).toBe(149);
		});

		it('should deserialize correctly', () => {
			const buf = Buffer.from([0]);
			const result = packet.stateLastHevCycleResult.toObject!(buf);
			expect(result.result).toBe(0);
		});
	});
});

describe('Relay packets', () => {
	describe('getRelayPower', () => {
		it('should have correct type', () => {
			expect(packet.getRelayPower.type).toBe(816);
		});

		it('should have size 1', () => {
			expect(packet.getRelayPower.size).toBe(1);
		});

		it('should serialize correctly', () => {
			const buf = packet.getRelayPower.toBuffer!({ relayIndex: 1 });
			expect(buf.length).toBe(1);
			expect(buf.readUInt8(0)).toBe(1);
		});
	});

	describe('setRelayPower', () => {
		it('should have correct type', () => {
			expect(packet.setRelayPower.type).toBe(817);
		});

		it('should have size 3', () => {
			expect(packet.setRelayPower.size).toBe(3);
		});

		it('should serialize correctly', () => {
			const buf = packet.setRelayPower.toBuffer!({ relayIndex: 2, level: 65535 });
			expect(buf.length).toBe(3);
			expect(buf.readUInt8(0)).toBe(2);
			expect(buf.readUInt16LE(1)).toBe(65535);
		});
	});

	describe('stateRelayPower', () => {
		it('should have correct type', () => {
			expect(packet.stateRelayPower.type).toBe(818);
		});

		it('should deserialize correctly', () => {
			const buf = Buffer.alloc(3);
			buf.writeUInt8(1, 0);
			buf.writeUInt16LE(65535, 1);

			const result = packet.stateRelayPower.toObject!(buf);
			expect(result.relayIndex).toBe(1);
			expect(result.level).toBe(65535);
		});
	});
});

describe('MultiZone Effect packets', () => {
	describe('getMultiZoneEffect', () => {
		it('should have correct type', () => {
			expect(packet.getMultiZoneEffect.type).toBe(507);
		});

		it('should have size 0', () => {
			expect(packet.getMultiZoneEffect.size).toBe(0);
		});
	});

	describe('setMultiZoneEffect', () => {
		it('should have correct type', () => {
			expect(packet.setMultiZoneEffect.type).toBe(508);
		});

		it('should have size 59', () => {
			expect(packet.setMultiZoneEffect.size).toBe(59);
		});

		it('should serialize correctly', () => {
			const buf = packet.setMultiZoneEffect.toBuffer!({
				instanceid: 1,
				type: 1,
				speed: 1000,
				duration: BigInt(5000),
				parameter: [0, 0, 0, 0, 0, 0, 0, 0]
			});
			expect(buf.length).toBe(59);
			expect(buf.readUInt32LE(0)).toBe(1);
			expect(buf.readUInt8(4)).toBe(1);
			expect(buf.readUInt32LE(7)).toBe(1000);
			expect(buf.readBigUInt64LE(11)).toBe(BigInt(5000));
		});
	});

	describe('stateMultiZoneEffect', () => {
		it('should have correct type', () => {
			expect(packet.stateMultiZoneEffect.type).toBe(509);
		});
	});
});

describe('MultiZone Extended packets', () => {
	describe('setExtendedColorZones', () => {
		it('should have correct type', () => {
			expect(packet.setExtendedColorZones.type).toBe(510);
		});

		it('should have size 664', () => {
			expect(packet.setExtendedColorZones.size).toBe(664);
		});
	});

	describe('getExtendedColorZones', () => {
		it('should have correct type', () => {
			expect(packet.getExtendedColorZones.type).toBe(511);
		});

		it('should have size 0', () => {
			expect(packet.getExtendedColorZones.size).toBe(0);
		});
	});

	describe('stateExtendedColorZones', () => {
		it('should have correct type', () => {
			expect(packet.stateExtendedColorZones.type).toBe(512);
		});

		it('should have size 661', () => {
			expect(packet.stateExtendedColorZones.size).toBe(661);
		});
	});
});

describe('Tile Effect packets', () => {
	describe('copyFrameBuffer', () => {
		it('should have correct type', () => {
			expect(packet.copyFrameBuffer.type).toBe(716);
		});

		it('should have size 15', () => {
			expect(packet.copyFrameBuffer.size).toBe(15);
		});
	});

	describe('getTileEffect', () => {
		it('should have correct type', () => {
			expect(packet.getTileEffect.type).toBe(718);
		});

		it('should have size 2', () => {
			expect(packet.getTileEffect.size).toBe(2);
		});
	});

	describe('setTileEffect', () => {
		it('should have correct type', () => {
			expect(packet.setTileEffect.type).toBe(719);
		});

		it('should have size 188', () => {
			expect(packet.setTileEffect.size).toBe(188);
		});
	});

	describe('stateTileEffect', () => {
		it('should have correct type', () => {
			expect(packet.stateTileEffect.type).toBe(720);
		});

		it('should have size 187', () => {
			expect(packet.stateTileEffect.size).toBe(187);
		});
	});
});

describe('Button packets', () => {
	describe('getButton', () => {
		it('should have correct type', () => {
			expect(packet.getButton.type).toBe(905);
		});

		it('should have size 0', () => {
			expect(packet.getButton.size).toBe(0);
		});
	});

	describe('getButtonConfig', () => {
		it('should have correct type', () => {
			expect(packet.getButtonConfig.type).toBe(909);
		});
	});

	describe('setButtonConfig', () => {
		it('should have correct type', () => {
			expect(packet.setButtonConfig.type).toBe(910);
		});

		it('should have size 18', () => {
			expect(packet.setButtonConfig.size).toBe(18);
		});
	});

	describe('stateButtonConfig', () => {
		it('should have correct type', () => {
			expect(packet.stateButtonConfig.type).toBe(911);
		});

		it('should have size 18', () => {
			expect(packet.stateButtonConfig.size).toBe(18);
		});
	});
});
