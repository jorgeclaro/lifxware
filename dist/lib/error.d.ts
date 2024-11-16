/**
 * ErrorSeverity defines the severity level of an error
 */
export declare enum ErrorSeverity {
    /**
     * Low severity is used for cases that this error DOES NOT cause any real
     * impact on the service operation.
     *
     * This level corresponds to 'info' level in logs.
     */
    Low = 0,
    /**
     * Medium severity is used for the cases where the error can have partial
     * or limited impact on the application but for which the team has no
     * real control of. E.g an external dependency being down.
     *
     * This level corresponds to 'warning' level in logs.
     */
    Medium = 1,
    /**
     * High severity is used whenever the error compromises the application.
     * For example, unhandled exceptions, service own database is down,
     * wrongly formatted messages, etc.
     *
     * This level corresponds to 'error' level in logs.
     */
    High = 2
}
/**
 * Defines the structural interface of an error
 */
export interface IError {
    /** The service internal error code */
    code: string;
    /** The message explaining why this error occurred */
    message: string;
    /** The severity level of the error that just occurred */
    severity: ErrorSeverity;
}
/**
 * ServiceError defines the base structure of errors
 */
export declare class ServiceError extends Error {
    /** The type of error thrown */
    error: IError;
    /** Optional contextual message that explains the error */
    contextualMessage?: string;
    /**
     * Optional original error being wrapped by the service error
     *
     * This value must be set if the full stack trace of all the errors that
     * bubbled is to be pushed into the logs.
     */
    innerError?: Error;
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
    constructor(e: IError, contextualMessage?: string, innerError?: Error);
    /**
     * Logs the error to the logging system with the correct level and details
     */
    log(): void;
    /**
     * Builds an error containing a stack of all the encapsulated errors
     */
    buildStackError(): Error;
    /**
     * Returns this service error as a string
     */
    toString(): string;
}
/**
 * Definition of service error builder
 */
export declare class ServiceErrorBuilder {
    /** The type of error that was thrown */
    protected _error: IError;
    /** Optional contextual message of why the error was thrown */
    protected _contextualMessage?: string;
    /** Optional inner error that is being wrapped by the builder */
    protected _innerError?: Error;
    /**
     * Constructor
     *
     * @param error
     *  The type of error being thrown
     */
    constructor(error: IError);
    /**
     * Adds an additional contextual message to explain why the error was thrown
     *
     * @param message
     *  The error contextual message
     */
    withContextualMessage(message: string): this;
    /**
     * Adds an error as being the cause this error was thrown
     *
     * This is important to be set if you want to see a full stack trace of
     * errors that caused this error in the logs.
     *
     * @param error
     *  The error that is being wrapped
     */
    withInnerError(error: Error): this;
    /**
     * Builds a ServiceError with the information that was passed to the builder
     */
    build(): ServiceError;
}
//# sourceMappingURL=error.d.ts.map