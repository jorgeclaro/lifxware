import { logger } from './logger';
/**
 * ErrorSeverity defines the severity level of an error
 */
export var ErrorSeverity;
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
})(ErrorSeverity || (ErrorSeverity = {}));
/**
 * ServiceError defines the base structure of errors
 */
export class ServiceError extends Error {
    /** The type of error thrown */
    error;
    /** Optional contextual message that explains the error */
    contextualMessage;
    /**
     * Optional original error being wrapped by the service error
     *
     * This value must be set if the full stack trace of all the errors that
     * bubbled is to be pushed into the logs.
     */
    innerError;
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
                logger.error(stackError, title);
                break;
            case ErrorSeverity.Medium:
                logger.warn(title, stackError);
                break;
            case ErrorSeverity.Low:
                logger.info(title, stackError);
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
/**
 * Definition of service error builder
 */
export class ServiceErrorBuilder {
    /** The type of error that was thrown */
    _error;
    /** Optional contextual message of why the error was thrown */
    _contextualMessage;
    /** Optional inner error that is being wrapped by the builder */
    _innerError;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbEM7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxhQTBCWDtBQTFCRCxXQUFZLGFBQWE7SUFDeEI7Ozs7O09BS0c7SUFDSCwrQ0FBRyxDQUFBO0lBRUg7Ozs7OztPQU1HO0lBQ0gscURBQU0sQ0FBQTtJQUVOOzs7Ozs7T0FNRztJQUNILGlEQUFJLENBQUE7QUFDTCxDQUFDLEVBMUJXLGFBQWEsS0FBYixhQUFhLFFBMEJ4QjtBQWdCRDs7R0FFRztBQUNILE1BQU0sT0FBTyxZQUFhLFNBQVEsS0FBSztJQUN0QywrQkFBK0I7SUFDL0IsS0FBSyxDQUFTO0lBRWQsMERBQTBEO0lBQzFELGlCQUFpQixDQUFVO0lBRTNCOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUFTO0lBRW5COzs7Ozs7Ozs7T0FTRztJQUNILFlBQVksQ0FBUyxFQUFFLGlCQUEwQixFQUFFLFVBQWtCO1FBQ3BFLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDekIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUc7UUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRTFDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM3QixLQUFLLGFBQWEsQ0FBQyxJQUFJO2dCQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDaEMsTUFBTTtZQUVQLEtBQUssYUFBYSxDQUFDLE1BQU07Z0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixNQUFNO1lBRVAsS0FBSyxhQUFhLENBQUMsR0FBRztnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQy9CLE1BQU07UUFDUixDQUFDO0lBQ0YsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZUFBZTtRQUNkLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuRCxrQ0FBa0M7UUFDbEMsSUFBSSxTQUFTLEdBQXNCLElBQUksQ0FBQztRQUV4QyxPQUFPLFNBQVMsWUFBWSxZQUFZLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xFLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV2QyxTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQztRQUNsQyxDQUFDO1FBRUQsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFNUMsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ1AsT0FBTyxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQzVELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUNuRCxFQUFFLENBQUM7SUFDSixDQUFDO0NBQ0Q7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxtQkFBbUI7SUFDL0Isd0NBQXdDO0lBQzlCLE1BQU0sQ0FBUztJQUV6Qiw4REFBOEQ7SUFDcEQsa0JBQWtCLENBQVU7SUFFdEMsZ0VBQWdFO0lBQ3RELFdBQVcsQ0FBUztJQUU5Qjs7Ozs7T0FLRztJQUNILFlBQVksS0FBYTtRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxxQkFBcUIsQ0FBQyxPQUFlO1FBQ3BDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUM7UUFFbEMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjLENBQUMsS0FBWTtRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUV6QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUs7UUFDSixPQUFPLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRixDQUFDO0NBQ0QifQ==