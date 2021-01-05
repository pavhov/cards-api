import { v4 }                                               from "uuid";
import { DataTypes, Model as BaseModel }                    from "sequelize";
import { ModelAttributeColumnOptions, ModelIndexesOptions } from "sequelize/types/lib/model";

import ITransaction from "./Interface";

export default class TransactionModel extends BaseModel<ITransaction> {
    /**
     * @name modelName
     */
    public static modelName = "Transaction";

    /**
     * @name tableName
     */
    public static tableName = "transaction";

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
     * @name VoucherCode
     */
    public static VoucherCode?: ModelAttributeColumnOptions = {
        type: DataTypes.STRING,
        field: "voucher_code",
        allowNull: false,
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
     * @name StatusSnapshot
     */
    public static StatusSnapshot?: ModelAttributeColumnOptions = {
        type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED", "VOID", "EXPIRED"),
        field: "status_snapshot",
        allowNull: false,
        comment: "PENDING | IN_PROGRESS | COMPLETED | VOID | EXPIRED"
    };

    /**
     * @name SearchVector
     */
    public static SearchVector?: ModelAttributeColumnOptions = {
        type: "TSVECTOR",
        field: "search_vector",
        allowNull: true,
    };

    /**
     * @name CreatedDtm
     */
    public static CreatedDtm?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "created_dtm",
    };

    /**
     * @name ValidStartDtm
     */
    public static ValidStartDtm?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "valid_start_dtm",
        allowNull: false,
    };

    /**
     * @name ValidEndDtm
     */
    public static ValidEndDtm?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "valid_end_dtm",
        allowNull: false,
    };

    /**
     * @name _fieldSet
     */
    private static _fieldSet = {
        TransactionId: TransactionModel.TransactionId,
        ClientId: TransactionModel.ClientId,
        VoucherId: TransactionModel.VoucherId,
        VoucherCode: TransactionModel.VoucherCode,
        BatchNo: TransactionModel.BatchNo,
        StatusSnapshot: TransactionModel.StatusSnapshot,
        SearchVector: TransactionModel.SearchVector,
        CreatedDtm: TransactionModel.CreatedDtm,
        ValidStartDtm: TransactionModel.ValidStartDtm,
        ValidEndDtm: TransactionModel.ValidEndDtm,
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
            fields: [TransactionModel.VoucherCode.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.ClientId.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.BatchNo.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.StatusSnapshot.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.ValidStartDtm.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.ValidEndDtm.field],
            type: "SPATIAL",
        }, {
            fields: [TransactionModel.SearchVector.field],
            type: "FULLTEXT",
            using: "GIN",
            parser: "blank"
            // parser: "hword_part"
        }];
    }

}
