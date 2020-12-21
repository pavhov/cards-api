import CModule       from "./../../lib/abstract/CModule";
import { ModuleInt } from "../../lib/decorators/CModule";

/**
 * @name Listener
 */
@ModuleInt
export default class Listener extends CModule {
    /**
     * @name Listener
     */
    constructor() {
        super();
    }

    /**
     * @name context
     */
    async context(): Promise<void> {
        this.p.on("rejectionHandled", (...args) => {
            console.error("rejectionHandled", ...args);
        });
        this.p.on("uncaughtException", (...args) => {
            console.error("uncaughtException", ...args);
        });
        this.p.on("unhandledRejection", (...args) => {
            console.error("unhandledRejection", ...args);
        });
        return Promise.resolve(undefined);
    }

    /**
     * @name destroy
     */
    async destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
