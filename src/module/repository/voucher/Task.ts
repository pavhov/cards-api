import { BulkCreateOptions, InstanceUpdateOptions, literal, Transaction }                                          from "sequelize";
import { CreateOptions, DestroyOptions, FindOptions, InitOptions, ModelStatic, NonNullFindOptions, UpdateOptions } from "sequelize/types/lib/model";
import { HookReturn }                                                                                              from "sequelize/types/lib/hooks";

import { DBModuleInIt } from "../../../lib/decorators/DBModul";
import DBStory          from "./../../../lib/abstract/DBStory";

import Model            from "./Model";
import ClientModel      from "./../client/Model";
import TransactionModel from "../transaction/Model";
import ItemModel        from "../item/Model";

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
            hooks: {
                afterCreate: this.afterCreate,
                afterUpdate: this.afterUpdate,
            },
        } as InitOptions<Model>;

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


    async afterCreate(attributes: Model, options: CreateOptions<Model["_attributes"]>): Promise<void> {
        let val = `to_tsvector("${Model.tableName}"."${Model.VoucherCode.field}" `;
        if (attributes.getDataValue("BatchNo")) {
            val += `|| ' ' || "${Model.tableName}"."${Model.BatchNo.field}"`;
        }
        val += ")";
        await Model.update({"SearchVector": literal(val)}, {...options, where: {VoucherId: (attributes as any).VoucherId}, hooks: false});
    }

    async afterUpdate(instance: Model, options: InstanceUpdateOptions<Model["_attributes"]>): Promise<void> {
        let val = `to_tsvector("${Model.tableName}"."${Model.VoucherCode.field}" `;
        if (instance.getDataValue("BatchNo")) {
            val += `|| ' ' || "${Model.tableName}"."${Model.BatchNo.field}"`;
        }
        val += ")";
        await Model.update({"SearchVector": literal(val)}, {...options, where: {VoucherId: (instance as any).VoucherId}, hooks: false});
    }

    /**
     * @name getOne
     * @param options
     */
    public getOne(options: NonNullFindOptions<Model["_attributes"]>): Promise<Model> {
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
     * @name getListAndCount
     * @param options
     */
    public getListAndCount<M extends Model>(options?: FindOptions<M["_attributes"]>): Promise<{ rows: Model[]; count: number }> {
        return Model.findAndCountAll({
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
     * @name removeOne
     * @param values
     */
    public removeOne(values: DestroyOptions<Model["_attributes"]>): Promise<number> {
        return Model.destroy(values);
    }

    /**
     * @name upsertOne
     * @param values
     * @param options
     */
    public async upsertOne<M extends Model>(values: Partial<Model["_attributes"]>, options: NonNullFindOptions<M["_attributes"]>): Promise<[number, Model[]]> {
        const obj = await this.getOne({rejectOnEmpty: true, where: options.where});
        if (obj) {
            return this.updateOne(values, {where: options.where});
        }
        return this._model.create({...options.where, ...values});
    }

    /**
     * @name createOne
     * @param values
     * @param options
     */
    public async createOne(values: Model["_creationAttributes"], options?: CreateOptions<Model["_attributes"]>): Promise<Model | Transaction | any> {
        return await Model.create(values, options);
    }

    /**
     * @name transaction
     */
    public async transaction(): Promise<Transaction> {
        return await Model.sequelize.transaction({benchmark: true});
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
     * @name items
     * @param conditions
     */
    public items(conditions?: ModelStatic<ItemModel>) {
        return {
            model: ItemModel,
            required: false,
            where: conditions,
            as: "items",
        } as any;
    }

    /**
     * @name transactions
     * @param conditions
     */
    public transactions(conditions?: ModelStatic<TransactionModel>) {
        return {
            model: TransactionModel,
            required: false,
            where: conditions,
            as: "transactions",
        } as any;
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
        Model.hasMany(TransactionModel, {
            as: "transactions",
            foreignKey: "VoucherId",
            sourceKey: "VoucherId",
        });
        Model.hasMany(ItemModel, {
            as: "items",
            foreignKey: "VoucherId",
            sourceKey: "VoucherId",
        });
    }
}
