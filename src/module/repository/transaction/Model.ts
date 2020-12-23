import { v4 }                                               from "uuid";
import { DataTypes, Model as BaseModel }                    from "sequelize";
import { ModelAttributeColumnOptions, ModelIndexesOptions } from "sequelize/types/lib/model";

import ITransaction from "./Interface";

export default class TransactionModel extends BaseModel<ITransaction> {
    /**
     * @name TransactionId
     */
    public static TransactionId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "transaction_id",
        allowNull: false,
        primaryKey: true,
        unique: true,
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
     * @name ClientId
     */
    public static ClientId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "client_id",
        allowNull: false,
        references: {
            model: "client",
            key: "client_id",
        },
    };

    /**
     * @name BatchNo
     */
    public static BatchNo?: ModelAttributeColumnOptions = {
        type: DataTypes.STRING,
        field: "batch_no",
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
     * @name StatusSnapshot
     */
    public static StatusSnapshot?: ModelAttributeColumnOptions = {
        type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED", "VOID", "EXPIRED"),
        field: "status_snapshot",
        allowNull: false,
        comment: "PENDING | IN_PROGRESS | COMPLETED | VOID | EXPIRED"
    };

    /**
     * @name modelName
     */
    public static modelName = "Transaction";

    /**
     * @name tableName
     */
    public static tableName = "transaction";

    /**
     * @name _fieldSet
     */
    private static _fieldSet = {
        TransactionId: TransactionModel.TransactionId,
        VoucherId: TransactionModel.VoucherId,
        ClientId: TransactionModel.ClientId,
        BatchNo: TransactionModel.BatchNo,
        CreatedDtm: TransactionModel.CreatedDtm,
        StatusSnapshot: TransactionModel.StatusSnapshot,
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
            fields: [TransactionModel.TransactionId.field],
            type: "UNIQUE",
        }, {
            fields: [TransactionModel.VoucherId.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.ClientId.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.BatchNo.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.CreatedDtm.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.StatusSnapshot.field],
            type: "SPATIAL",
        },];
    }

}
