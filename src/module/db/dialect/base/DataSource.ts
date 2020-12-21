import CModule, { staticModules } from "./../../../../lib/abstract/CModule";
import MysqlDataSource            from "./../postgresql/DataSource";
import { ModuleInt }              from "../../../../lib/decorators/CModule";

/**
 * @name DataSource
 */
@ModuleInt
export default class DataSource extends CModule {
    private staticModules: Array<any>;

    /**
     * @name _default
     * @private
     */
    private readonly _default: MysqlDataSource | any;

    /**
     * @name DataSource
     */
    constructor() {
        super();

        this._default = new MysqlDataSource();
        this.staticModules = staticModules;

        if (!DataSource._instance) {
            DataSource._instance = this;
        }
    }

    /**
     * @name _instance
     * @private
     */
    private static _instance: DataSource;

    /**
     * @name get instance
     */
    static get instance(): DataSource {
        return this._instance;
    }

    /**
     * @name set instance
     */
    static set instance(_value: DataSource) {

    }

    /**
     * @name get default
     */
    get default() {
        return this._default;
    }

    /**
     * @name set default
     */
    set default(_value) {

    }

    /**
     * @name context
     * @protected
     */
    protected async context(): Promise<void> {
        await Promise.all(this.staticModules.map(async (value: any) => value.Instance().init()));
        await this._default.init();
        return Promise.resolve(undefined);
    }

    /**
     * @name destroy
     * @protected
     */
    protected async destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }

}
