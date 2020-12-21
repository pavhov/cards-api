import { v4 }                                               from "uuid";
import { DataTypes, Model as BaseModel }                    from "sequelize";
import { ModelAttributeColumnOptions, ModelIndexesOptions } from "sequelize/types/lib/model";

import IToken from "./Interface";

export default class TokenModel extends BaseModel<IToken> {
    /**
     * @name Id
     */
    public static TokenId?: ModelAttributeColumnOptions = {
        type: DataTypes.UUID,
        field: "token_id",
        allowNull: false,
        primaryKey: true,
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
        allowNull: true,
        references: {
            model: "client",
            key: "client_id",
        },
    };

    /**
     * @name AccessToken
     */
    public static AccessToken?: ModelAttributeColumnOptions = {
        type: DataTypes.TEXT,
        field: "access_token",
        allowNull: true,
    };

    /**
     * @name ExpiresIn
     */
    public static ExpiresIn?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "expires_in",
        allowNull: true,
    };

    /**
     * @name RefreshToken
     */
    public static RefreshToken?: ModelAttributeColumnOptions = {
        type: DataTypes.TEXT,
        field: "refresh_token",
        allowNull: true,
    };

    /**
     * @name RefreshTokenExpiresIn
     */
    public static RefreshTokenExpiresIn?: ModelAttributeColumnOptions = {
        type: DataTypes.DATE,
        field: "refresh_token_expires_in",
        allowNull: true,
    };

    /**
     * @name modelName
     */
    public static modelName = "Token";

    /**
     * @name tableName
     */
    public static tableName = "token";

    /**
     * @name _fieldSet
     */
    private static _fieldSet = {
        TokenId: TokenModel.TokenId,
        ClientId: TokenModel.ClientId,
        AccessToken: TokenModel.AccessToken,
        ExpiresIn: TokenModel.ExpiresIn,
        RefreshToken: TokenModel.RefreshToken,
        RefreshTokenExpiresIn: TokenModel.RefreshTokenExpiresIn,

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
            fields: [TokenModel.AccessToken.field],
            type: "UNIQUE",
        }, {
            fields: [TokenModel.RefreshToken.field],
            type: "UNIQUE",
        }, {
            fields: [TokenModel.ExpiresIn.field],
            type: "SPATIAL",
        }, {
            fields: [TokenModel.RefreshTokenExpiresIn.field],
            type: "SPATIAL",
        }, {
            fields: [TokenModel.ClientId.field],
            type: "SPATIAL",
        }];
    }
}
