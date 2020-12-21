import DataSource                       from "./../../module/db/dialect/base/DataSource";
import { InitOptions, ModelAttributes } from "sequelize";
import { Model }                        from "sequelize/types";

/**
 * @name DBStory
 */
export default abstract class DBStory {
    /**
     * @name _attributes
     * @protected
     */
    protected _attributes: ModelAttributes<Model<any, any>>;
    /**
     * @name _options
     * @protected
     */
    protected _options: InitOptions<Model<any, any>>;

    /**
     * @name _model
     * @protected
     */
    protected _model: Model<any, any> | any;

    /**
     * @name model
     * @return any | Model
     */
    get model(): any {
        return this._model;
    }

    /**
     * @name init
     */
    public init() {
        this._options = {
            ...this._options,
            sequelize: DataSource.instance.default.connector,
            tableName: this._model.tableName,
            modelName: this._model.modelName,
            indexes: this._model.indexes,

        };
        this._model.init(this._attributes, this._options);
        setImmediate(() => this.assocs());
    }

    protected assocs() {
    }

}
