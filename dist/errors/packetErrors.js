import { ErrorSeverity } from '../lib/error';
export const ER_PACKET_UNKNOWN = {
    code: 'ER_PACKET_UNKNOWN',
    message: 'Unknown packet',
    severity: ErrorSeverity.High
};
export const ER_PACKET_INVALID_SIZE = {
    code: 'ER_PACKET_INVALID_SIZE',
    message: 'Invalid packet size',
    severity: ErrorSeverity.High
};
//# sourceMappingURL=packetErrors.js.map