"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ER_LIGHT_MISSING_CACHE = exports.ER_LIGHT_COLOR_RANGE = exports.ER_LIGHT_CMD_TIMEOUT = exports.ER_LIGHT_CMD_NOT_SUPPORTED = exports.ER_LIGHT_OFFLINE = void 0;
const error_1 = require("../lib/error");
exports.ER_LIGHT_OFFLINE = {
    code: 'ER_LIGHT_OFFLINE',
    message: 'Light is offline',
    severity: error_1.ErrorSeverity.High
};
exports.ER_LIGHT_CMD_NOT_SUPPORTED = {
    code: 'ER_LIGHT_CMD_NOT_SUPPORTED',
    message: 'Command not supported',
    severity: error_1.ErrorSeverity.High
};
exports.ER_LIGHT_CMD_TIMEOUT = {
    code: 'ER_LIGHT_CMD_TIMEOUT',
    message: 'Timeout',
    severity: error_1.ErrorSeverity.High
};
exports.ER_LIGHT_COLOR_RANGE = {
    code: 'ER_LIGHT_COLOR_RANGE',
    message: 'Color values out of range',
    severity: error_1.ErrorSeverity.High
};
exports.ER_LIGHT_MISSING_CACHE = {
    code: 'ER_LIGHT_MISSING_CACHE',
    message: 'Cache of color values is missing',
    severity: error_1.ErrorSeverity.High
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRFcnJvcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL2xpZ2h0RXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFxRDtBQUV4QyxRQUFBLGdCQUFnQixHQUFXO0lBQ3ZDLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsT0FBTyxFQUFFLGtCQUFrQjtJQUMzQixRQUFRLEVBQUUscUJBQWEsQ0FBQyxJQUFJO0NBQzVCLENBQUM7QUFFVyxRQUFBLDBCQUEwQixHQUFXO0lBQ2pELElBQUksRUFBRSw0QkFBNEI7SUFDbEMsT0FBTyxFQUFFLHVCQUF1QjtJQUNoQyxRQUFRLEVBQUUscUJBQWEsQ0FBQyxJQUFJO0NBQzVCLENBQUM7QUFFVyxRQUFBLG9CQUFvQixHQUFXO0lBQzNDLElBQUksRUFBRSxzQkFBc0I7SUFDNUIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsUUFBUSxFQUFFLHFCQUFhLENBQUMsSUFBSTtDQUM1QixDQUFDO0FBRVcsUUFBQSxvQkFBb0IsR0FBVztJQUMzQyxJQUFJLEVBQUUsc0JBQXNCO0lBQzVCLE9BQU8sRUFBRSwyQkFBMkI7SUFDcEMsUUFBUSxFQUFFLHFCQUFhLENBQUMsSUFBSTtDQUM1QixDQUFDO0FBRVcsUUFBQSxzQkFBc0IsR0FBVztJQUM3QyxJQUFJLEVBQUUsd0JBQXdCO0lBQzlCLE9BQU8sRUFBRSxrQ0FBa0M7SUFDM0MsUUFBUSxFQUFFLHFCQUFhLENBQUMsSUFBSTtDQUM1QixDQUFDIn0=