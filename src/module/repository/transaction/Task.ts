import { DBModuleInIt } from "../../../lib/decorators/DBModul";
import DBStory          from "./../../../lib/abstract/DBStory";

import Model                                                                                          from "./Model";
import { CreateOptions, DestroyOptions, FindOptions, Includeable, NonNullFindOptions, UpdateOptions } from "sequelize/types/lib/model";
import ClientModel                                                                                    from "./../client/Model";
import VoucherModel                                                                                   from "./../voucher/Model";
import { InstanceUpdateOptions, literal, Transaction }                                                from "sequelize";

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
            createdAt: "created_dtm",
            updatedAt: false,
            hooks: {
                afterCreate: this.afterCreate,
                afterUpdate: this.afterUpdate,
            },
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

    async afterCreate(attributes: Model, options: CreateOptions<Model["_attributes"]>): Promise<void> {
        let val = `to_tsvector("${
            Model.tableName}"."${Model.TransactionId.field}" || ' ' || "${
            Model.tableName}"."${Model.VoucherId.field}" || ' ' || "${
            Model.tableName}"."${Model.VoucherCode.field}" || ' ' || "${
            Model.tableName}"."${Model.CreatedDtm.field}" || ' ' || "${
            Model.tableName}"."${Model.BatchNo.field}")`;
        await Model.update({SearchVector: literal(val)} as any, {...options, where: {TransactionId: (attributes as any).TransactionId}, hooks: false});
    }

    async afterUpdate(instance: Model, options: InstanceUpdateOptions<Model["_attributes"]>): Promise<void> {
        let val = `to_tsvector("${
            Model.tableName}"."${Model.TransactionId.field}" || ' ' || "${
            Model.tableName}"."${Model.VoucherId.field}" || ' ' || "${
            Model.tableName}"."${Model.VoucherCode.field}" || ' ' || "${
            Model.tableName}"."${Model.CreatedDtm.field}" || ' ' || "${
            Model.tableName}"."${Model.BatchNo.field}")`;
        await Model.update({SearchVector: literal(val)} as any, {...options, where: {TransactionId: (instance as any).TransactionId}, hooks: false});
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
     * @name voucher
     * @param conditions
     */
    public voucher(conditions?: NonNullFindOptions<VoucherModel["_attributes"]>["where"]): Includeable {
        return {
            model: VoucherModel as any,
            required: true,
            where: conditions,
            as: "voucher",
        };
    }

    /**
     * @name client
     * @param conditions
     */
    public client(conditions?: NonNullFindOptions<ClientModel["_attributes"]>["where"]): Includeable {
        return {
            model: ClientModel as any,
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
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        Model.belongsTo(VoucherModel, {
            as: "voucher",
            foreignKey: "VoucherId",
            targetKey: "VoucherId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
