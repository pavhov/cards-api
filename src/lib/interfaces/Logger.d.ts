export default interface LoggerInterface {
    level: "info" | "debug" | "warning" | "error"

    /**
     * @name Log
     * @param data
     * @param type
     * @constructor
     */
    Log(data, type?: this["level"]): void;

    /**
     * @name Return
     * @param data
     * @constructor
     */
    Return(...data): void;
}

export interface LoggerOptions {
    level: "info" | "debug" | "warning" | "error"
}
