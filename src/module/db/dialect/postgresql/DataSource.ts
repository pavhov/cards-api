import { Sequelize }        from "sequelize";
import { Dialect, Options } from "sequelize/types/lib/sequelize";

import CModule   from "./../../../../lib/abstract/CModule";
import Params    from "./../../../../lib/utils/config/Params";
import { debug } from "../../../../lib/utils/Logger";

/**
 * @name MysqlDataSource
 */
export default class MysqlDataSource extends CModule {
    /**
     * @name _options
     * @private
     */
    private readonly _options: Options;
    /**
     * @name _connector
     * @private
     */
    private readonly _connector: Sequelize;

    /**
     * @name MysqlDataSource
     */
    constructor() {
        super();
        this._options = {
            dialect: Params["db_dialect"] as Dialect,
            host: Params["db_host"],
            port: parseInt(Params["db_port"]),
            username: Params["db_user"],
            password: Params["db_pass"],
            database: Params["db_name"],
            logging: debug,
            omitNull: true,
            define: {
                timestamps: false,
            },
            pool: {
                max: parseInt(Params["db_pool_max"]), //25,
                min: parseInt(Params["db_pool_min"]), //15,
            }
        };
        this._connector = new Sequelize(this._options);
        if (MysqlDataSource._instance) {
            MysqlDataSource._instance = this;
        }
    }

    /**
     * @name _instance
     * @private
     */
    private static _instance: MysqlDataSource;

    /**
     * @name get instance
     */
    public static get instance() {
        return this._instance;
    }

    /**
     * @name set instance
     */
    public static set instance(_instance) {

    }

    /**
     * @name get connector
     */
    public get connector() {
        return this._connector;
    }

    /**
     * @name set connector
     */
    public set connector(_connector) {

    }

    /**
     * @name context
     * @protected
     */
    protected async context(): Promise<void> {
        await this._connector.authenticate();
        await this._connector.sync({force: false});
        console.log(`Dialect started on ${this._options.dialect}://${this._options.host}:${this._options.port}/${this._options.database}`);
        return Promise.resolve(undefined);
    }

    /**
     * @name destroy
     * @protected
     */
    protected async destroy(): Promise<void> {
        await this._connector.close();
        return Promise.resolve(undefined);
    }

}
