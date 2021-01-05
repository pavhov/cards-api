import chai           from "chai";
import chaiJsonSchema from "chai-json-schema";
import sequelize      from "sequelize";
import conf           from "../../src/lib/utils/config/Params";

export const Sequelize = new sequelize.Sequelize({
    dialect: conf["db_dialect"],
    username: conf["db_user"],
    password: conf["db_pass"],
    database: conf["db_name"],
    logging: false,
});

chai.use(chaiJsonSchema);

export let vars = {
    clients: [],
    vouchers: [],
    transactions: [],
    voucherResults: [],
    transactionResults: [],
    authResults: [],
    now: Date.now()
};
