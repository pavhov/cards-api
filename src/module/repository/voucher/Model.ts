import { v4 }                                               from "uuid";
import { DataTypes, Model as BaseModel, literal }           from "sequelize";
import { ModelAttributeColumnOptions, ModelIndexesOptions } from "sequelize/types/lib/model";

import IVoucher from "./Interface";

export default class VoucherModel extends BaseModel<IVoucher> {
    /**
     * @name modelName
     */
    public static modelName = "Voucher";

    /**
     * @name tableName
     */
    public static tableName = "voucher";

    /**
     * @name VoucherId
     */
    public static VoucherId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "voucher_id",
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: v4,
        validate: {
            notEmpty: true,
        }
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
        allowNull: true,
    };

    /**
     * @name VoucherCode
     */
    public static VoucherCode?: ModelAttributeColumnOptions = {
        type: DataTypes.STRING,
        field: "voucher_code",
        allowNull: true,
    };

    /**
     * @name QrSrc
     */
    public static QrSrc?: ModelAttributeColumnOptions = {
        type: DataTypes.STRING,
        field: "qr_src",
        allowNull: false,
    };

    /**
     * @name CreatedDtm
     */
    public static CreatedDtm?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "created_dtm",
    };

    /**
     * @name Status
     */
    public static Status?: ModelAttributeColumnOptions = {
        type: DataTypes.ENUM("PENDING", "IN_PROGRESS", "COMPLETED", "VOID", "EXPIRED"),
        field: "status",
        allowNull: false,
        comment: "PENDING | IN_PROGRESS | COMPLETED | VOID | EXPIRED",
    };

    /**
     * @name Locations
     */
    public static Locations?: ModelAttributeColumnOptions = {
        type: `${DataTypes.TEXT} []`,
        field: "locations",
        allowNull: true,
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
        VoucherId: VoucherModel.VoucherId,
        ClientId: VoucherModel.ClientId,
        BatchNo: VoucherModel.BatchNo,
        VoucherCode: VoucherModel.VoucherCode,
        QrSrc: VoucherModel.QrSrc,
        CreatedDtm: VoucherModel.CreatedDtm,
        Status: VoucherModel.Status,
        Locations: VoucherModel.Locations,
        SearchVector: VoucherModel.SearchVector,
        ValidStartDtm: VoucherModel.ValidStartDtm,
        ValidEndDtm: VoucherModel.ValidEndDtm,
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
            fields: [VoucherModel.VoucherId.field],
            type: "UNIQUE",
        }, {
            fields: [VoucherModel.ClientId.field],
            type: "SPATIAL",
        }, {
            fields: [VoucherModel.BatchNo.field],
            type: "SPATIAL",
        }, {
            fields: [VoucherModel.VoucherCode.field],
            type: "UNIQUE",
        }, {
            fields: [VoucherModel.QrSrc.field],
            type: "UNIQUE",
        }, {
            fields: [VoucherModel.Status.field],
            type: "SPATIAL",
        }, {
            fields: [VoucherModel.ValidStartDtm.field],
            type: "SPATIAL",
        }, {
            fields: [VoucherModel.ValidEndDtm.field],
            type: "SPATIAL",
        }, {
            fields: [VoucherModel.SearchVector.field],
            type: "FULLTEXT",
            using: "GIN",
            parser: "blank"
            // parser: "hword_part"
        }];
    }
}
