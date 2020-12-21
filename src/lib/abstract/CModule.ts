import Module   from "./../interfaces/Module";
import { info } from "../utils/Logger";

export const modules: Array<any> = [];
export const staticModules: Array<any> = [];

/**
 * @name CModule
 */
export default abstract class CModule implements Module {
    /**
     * @name p
     * @protected
     */
    protected p: NodeJS.Process;

    /**
     * @name CModule
     * @protected
     */
    protected constructor() {
        this.p = process;
    }

    /**
     * @name init
     * @async
     */
    async init(): Promise<void> {
        info(`Starting ${this.constructor.name} module`);
        this.p.on("exit", () => this.stop());
        return await this.context();
    }

    /**
     * @name stop
     * @async
     */
    async stop(): Promise<void> {
        return await this.destroy();
    }

    /**
     * @name context
     * @protected
     */
    protected abstract context(): Promise<void>;

    /**
     * @name destroy
     * @protected
     */
    protected abstract destroy(): Promise<void>;

}
