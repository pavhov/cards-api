import { DBModuleInIt } from "../../../lib/decorators/DBModul";
import DBStory          from "./../../../lib/abstract/DBStory";

import Model                                                           from "./Model";
import { FindOptions, ModelStatic, NonNullFindOptions, UpdateOptions } from "sequelize/types/lib/model";
import ClientModel                                                     from "./../client/Model";

/**
 * @name Task
 */
@DBModuleInIt
export default class Task extends DBStory {
    /**
     * @name _instance
     * @private
     */
    private static _instance: Task;

    /**
     * @name Task
     */
    constructor() {
        super();
        this._model = Model;
        this._options = {
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        } as any;

        this._attributes = this._model.fieldSet;
    }

    /**
     * @name Instance
     * @constructor
     */
    static Instance(): Task {
        if (!Task._instance) {
            Task._instance = new Task();
        }

        return Task._instance;
    }

    /**
     * @name getOne
     * @param options
     */
    public getOne<M extends Model>(options: NonNullFindOptions<M["_attributes"]>): Promise<Model> {
        return Model.findOne({
            ...options,
            raw: false,
            nest: false,
            mapToModel: false,
        });
    }

    /**
     * @name getList
     * @param options
     */
    public getList<M extends Model>(options?: FindOptions<M["_attributes"]>): Promise<Model[]> {
        return Model.findAll({
            ...options,
            raw: false,
            nest: false,
            mapToModel: false,
        } as any);
    }

    /**
     * @name updateOne
     * @param values
     * @param options
     */
    public updateOne(values: Partial<Model["_attributes"]>, options: UpdateOptions<Model["_attributes"]>): Promise<[number, Model[]]> {
        return Model.update(values, options);
    }

    /**
     * @name upsertOne
     * @param values
     * @param options
     */
    public async upsertOne<M extends Model>(values: Partial<Model["_attributes"]>, options: NonNullFindOptions<M["_attributes"]>): Promise<Model | [number, Model[]]> {
        const obj = await this.getOne({rejectOnEmpty: true, where: options.where});
        if (obj) {
            return await this.updateOne(values, {where: options.where});
        }
        return await this.createOne({...options.where, ...values} as any);
    }

    /**
     * @name createOne
     * @param values
     * @param options
     */
    public async createOne<M extends Model>(values: M["_creationAttributes"], options?: NonNullFindOptions<M["_attributes"]>): Promise<Model> {
        return await Model.create(values);
    }

    /**
     * @name client
     * @param conditions
     */
    public client(conditions?: ModelStatic<ClientModel>) {
        return {
            model: ClientModel,
            required: true,
            where: conditions,
            as: "client",
        };
    }

    /**
     * @name assocs
     * @protected
     */
    protected assocs() {
        Model.belongsTo(ClientModel, {
            as: "client",
            foreignKey: "ClientId",
            targetKey: "ClientId",
        });
    }
}
