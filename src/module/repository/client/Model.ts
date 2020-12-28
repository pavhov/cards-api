import { v4 }                                               from "uuid";
import { DataTypes, Model as BaseModel }                    from "sequelize";
import { ModelAttributeColumnOptions, ModelIndexesOptions } from "sequelize/types/lib/model";

import IStore from "./Interface";

export default class ClientModel extends BaseModel<IStore> {
    /**
     * @name ClientId
     */
    public static ClientId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "client_id",
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: v4,
        validate: {
            notEmpty: true,
        }
    };

    /**
     * @name ClientIndex
     */
    public static ClientIndex?: ModelAttributeColumnOptions = {
        type: DataTypes.TEXT,
        field: "client_index",
        allowNull: false,
    };

    /**
     * @name ClientSecret
     */
    public static ClientSecret?: ModelAttributeColumnOptions = {
        type: DataTypes.TEXT,
        field: "client_secret",
        allowNull: false,
    };

    /**
     * @name Scopes
     */
    public static Scopes?: ModelAttributeColumnOptions = {
        type: `${DataTypes.TEXT} []`,
        field: "scopes",
        allowNull: false,
        comment: "voucher.read | voucher.write | voucher.redeem | voucher.void | transaction.read"
    };

    /**
     * @name modelName
     */
    public static modelName = "Client";

    /**
     * @name tableName
     */
    public static tableName = "client";

    /**
     * @name _fieldSet
     */
    private static _fieldSet = {
        ClientId: ClientModel.ClientId,
        ClientIndex: ClientModel.ClientIndex,
        ClientSecret: ClientModel.ClientSecret,
        Scopes: ClientModel.Scopes,
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
            fields: [ClientModel.ClientId.field],
            type: "UNIQUE",
        }, {
            fields: [ClientModel.ClientIndex.field],
            type: "UNIQUE",
        }, {
            fields: [ClientModel.ClientSecret.field],
            type: "SPATIAL",
        }, {
            fields: [ClientModel.Scopes.field],
            type: "SPATIAL",
        },];
    }
}
