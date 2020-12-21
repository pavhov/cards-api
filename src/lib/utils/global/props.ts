import "reflect-metadata";

/**
 * @name stack
 */
const stack = function (): string {
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    let err = new Error;

    Error.captureStackTrace(err, err as any);
    let stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
};

/**
 * @name line
 */
const line = function (): number | null {
    // @ts-ignore
    return global.__stack[3].getLineNumber();
};

/**
 * @name moduleFn
 */
const moduleFn = function (): string | null {
    // @ts-ignore
    return global.__stack[3].getFileName();
};

/**
 * @name functionFn
 */
const functionFn = function (): string | null {
    // @ts-ignore
    return global.__stack[3].getFunctionName();
};

export default (() => {
    Object.defineProperty(global, "__stack", {get: stack});

    Object.defineProperty(global, "__line", {get: line});

    Object.defineProperty(global, "__module", {get: moduleFn});

    Object.defineProperty(global, "__function", {get: functionFn});

})();
