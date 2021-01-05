import { v4 }                                               from "uuid";
import { DataTypes, Model as BaseModel }                    from "sequelize";
import { ModelAttributeColumnOptions, ModelIndexesOptions } from "sequelize/types/lib/model";

import IStore from "./Interface";

export default class ItemModel extends BaseModel<IStore> {
    /**
     * @name VoucherId
     */
    public static ItemId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "item_id",
        allowNull: false,
        primaryKey: true,
        defaultValue: v4,
        validate: {
            notEmpty: true,
        }
    };

    /**
     * @name VoucherId
     */
    public static VoucherId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "voucher_id",
        allowNull: false,
        references: {
            model: "voucher",
            key: "voucher_id",
        },
    };

    /**
     * @name ItemIndex
     */
    public static ItemIndex?: ModelAttributeColumnOptions = {
        type: DataTypes.STRING,
        field: "item_index",
        allowNull: false,
    };

    /**
     * @name Quantity
     */
    public static Quantity?: ModelAttributeColumnOptions = {
        type: DataTypes.INTEGER,
        field: "quantity",
        allowNull: false,
    };

    /**
     * @name CreatedDtm
     */
    public static CreatedDtm?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "created_dtm",
        allowNull: false,
    };

    /**
     * @name modelName
     */
    public static modelName = "Item";

    /**
     * @name tableName
     */
    public static tableName = "item";

    /**
     * @name _fieldSet
     */
    private static _fieldSet = {
        ItemId: ItemModel.ItemId,
        ItemIndex: ItemModel.ItemIndex,
        VoucherId: ItemModel.VoucherId,
        Quantity: ItemModel.Quantity,
        CreatedDtm: ItemModel.CreatedDtm,
    };

    /**
     * @name fieldSet
     */
    static get fieldSet() {
        return this._fieldSet;
    }

    /**
     * @name indexes
     */
    static get indexes(): ModelIndexesOptions[] {
        return [{
            fields: [ItemModel.ItemIndex.field, ItemModel.VoucherId.field],
            type: "UNIQUE",
        }, {
            fields: [ItemModel.ItemId.field],
            type: "UNIQUE",
        }, {
            fields: [ItemModel.VoucherId.field],
            type: "SPATIAL",
        }, {
            fields: [ItemModel.Quantity.field],
            type: "SPATIAL",
        },];
    }

}
