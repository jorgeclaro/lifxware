"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceErrorBuilder = exports.ServiceError = exports.ErrorSeverity = void 0;
const logger_1 = require("./logger");
/**
 * ErrorSeverity defines the severity level of an error
 */
var ErrorSeverity;
(function (ErrorSeverity) {
    /**
     * Low severity is used for cases that this error DOES NOT cause any real
     * impact on the service operation.
     *
     * This level corresponds to 'info' level in logs.
     */
    ErrorSeverity[ErrorSeverity["Low"] = 0] = "Low";
    /**
     * Medium severity is used for the cases where the error can have partial
     * or limited impact on the application but for which the team has no
     * real control of. E.g an external dependency being down.
     *
     * This level corresponds to 'warning' level in logs.
     */
    ErrorSeverity[ErrorSeverity["Medium"] = 1] = "Medium";
    /**
     * High severity is used whenever the error compromises the application.
     * For example, unhandled exceptions, service own database is down,
     * wrongly formatted messages, etc.
     *
     * This level corresponds to 'error' level in logs.
     */
    ErrorSeverity[ErrorSeverity["High"] = 2] = "High";
})(ErrorSeverity = exports.ErrorSeverity || (exports.ErrorSeverity = {}));
/**
 * ServiceError defines the base structure of errors
 */
class ServiceError extends Error {
    /**
     * Constructor
     *
     * @param e
     *  The type of error being thrown
     * @param contextualMessage
     *  Optional contextual message explaining why the error was thrown
     * @param innerError
     *  Optional inner error being wrapped by this service error
     */
    constructor(e, contextualMessage, innerError) {
        super();
        this.error = e;
        this.message = e.message;
        this.contextualMessage = contextualMessage;
        this.innerError = innerError;
    }
    /**
     * Logs the error to the logging system with the correct level and details
     */
    log() {
        const title = this.toString();
        const stackError = this.buildStackError();
        switch (this.error.severity) {
            case ErrorSeverity.High:
                logger_1.logger.error(stackError, title);
                break;
            case ErrorSeverity.Medium:
                logger_1.logger.warn(title, stackError);
                break;
            case ErrorSeverity.Low:
                logger_1.logger.info(title, stackError);
                break;
        }
    }
    /**
     * Builds an error containing a stack of all the encapsulated errors
     */
    buildStackError() {
        const error = new Error(this.toString());
        const stack = [this.stack];
        /*eslint-disable consistent-this*/
        let currError = this;
        while (currError instanceof ServiceError && currError.innerError) {
            stack.push(currError.innerError.stack);
            currError = currError.innerError;
        }
        error.stack = stack.join('\n\nCaused by: ');
        return error;
    }
    /**
     * Returns this service error as a string
     */
    toString() {
        return `[Error Code: ${this.error.code}] ${this.error.message} ${this.contextualMessage ? this.contextualMessage : ''}`;
    }
}
exports.ServiceError = ServiceError;
/**
 * Definition of service error builder
 */
class ServiceErrorBuilder {
    /**
     * Constructor
     *
     * @param error
     *  The type of error being thrown
     */
    constructor(error) {
        this._error = error;
    }
    /**
     * Adds an additional contextual message to explain why the error was thrown
     *
     * @param message
     *  The error contextual message
     */
    withContextualMessage(message) {
        this._contextualMessage = message;
        return this;
    }
    /**
     * Adds an error as being the cause this error was thrown
     *
     * This is important to be set if you want to see a full stack trace of
     * errors that caused this error in the logs.
     *
     * @param error
     *  The error that is being wrapped
     */
    withInnerError(error) {
        this._innerError = error;
        return this;
    }
    /**
     * Builds a ServiceError with the information that was passed to the builder
     */
    build() {
        return new ServiceError(this._error, this._contextualMessage, this._innerError);
    }
}
exports.ServiceErrorBuilder = ServiceErrorBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFrQztBQUVsQzs7R0FFRztBQUNILElBQVksYUEwQlg7QUExQkQsV0FBWSxhQUFhO0lBQ3hCOzs7OztPQUtHO0lBQ0gsK0NBQUcsQ0FBQTtJQUVIOzs7Ozs7T0FNRztJQUNILHFEQUFNLENBQUE7SUFFTjs7Ozs7O09BTUc7SUFDSCxpREFBSSxDQUFBO0FBQ0wsQ0FBQyxFQTFCVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQTBCeEI7QUFnQkQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxLQUFLO0lBZXRDOzs7Ozs7Ozs7T0FTRztJQUNILFlBQVksQ0FBUyxFQUFFLGlCQUEwQixFQUFFLFVBQWtCO1FBQ3BFLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUc7UUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRTFDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDNUIsS0FBSyxhQUFhLENBQUMsSUFBSTtnQkFDdEIsZUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU07WUFFUCxLQUFLLGFBQWEsQ0FBQyxNQUFNO2dCQUN4QixlQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDL0IsTUFBTTtZQUVQLEtBQUssYUFBYSxDQUFDLEdBQUc7Z0JBQ3JCLGVBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixNQUFNO1NBQ1A7SUFDRixDQUFDO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2QsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxLQUFLLEdBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRW5ELGtDQUFrQztRQUNsQyxJQUFJLFNBQVMsR0FBc0IsSUFBSSxDQUFDO1FBRXhDLE9BQU8sU0FBUyxZQUFZLFlBQVksSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFO1lBQ2pFLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QyxTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQztTQUNqQztRQUVELEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRTVDLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUTtRQUNQLE9BQU8sZ0JBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUM1RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFDbkQsRUFBRSxDQUFDO0lBQ0osQ0FBQztDQUNEO0FBckZELG9DQXFGQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxtQkFBbUI7SUFVL0I7Ozs7O09BS0c7SUFDSCxZQUFZLEtBQWE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gscUJBQXFCLENBQUMsT0FBZTtRQUNwQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDO1FBRWxDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsY0FBYyxDQUFDLEtBQVk7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFFekIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLO1FBQ0osT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakYsQ0FBQztDQUNEO0FBckRELGtEQXFEQyJ9