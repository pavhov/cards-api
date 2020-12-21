import IApplication from "./../interfaces/Application";
import CModule      from "./CModule";

/**
 * @name ApplicationRunner
 */
export default abstract class ApplicationRunner<M extends IApplication<M> | any> implements IApplication<any> {
    /**
     * @name instance
     */
    static instance: ApplicationRunner<IApplication<any>>;

    /**
     * @name modules
     */
    protected modules: Array<CModule> = [];

    /**
     * @name main
     */
    abstract main(): void;

    /**
     * @name shutdown
     */
    abstract shutdown(): void;

}
