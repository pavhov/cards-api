import fs              from "fs";
import util            from "util";
import * as path       from "path";
import qrcode          from "qrcode";
import nanoid          from "nanoid";
import moment                       from "moment";
import { literal, Op, Transaction } from "sequelize";
import querystring                  from "querystring";
import { FindOptions } from "sequelize/types/lib/model";

import Params   from "../../../lib/utils/config/Params";
import { json } from "../../../lib/utils/json/Parser";

import VoucherModel from "../../repository/voucher/Model";

import ItemTask    from "../../repository/item/Task";
import VoucherTask from "../../repository/voucher/Task";
import TransactionTask from "../../repository/transaction/Task";

import ItemInterface    from "../../repository/item/Interface";
import ClientInterface  from "../../repository/client/Interface";
import VoucherInterface from "../../repository/voucher/Interface";

const writeFile = util.promisify(fs.writeFile);

/**
 * @name Story
 */
export default class Story {
    /**
     * @name tasks
     */
    public tasks: {
        Item: ItemTask;
        Voucher: VoucherTask;
        Transaction: TransactionTask;
        QrKey: () => string
        VoucherCode: () => string
    };

    /**
     * @name Story
     */
    public constructor() {
        this.tasks = {
            Item: ItemTask.Instance(),
            Voucher: VoucherTask.Instance(),
            Transaction: TransactionTask.Instance(),
            QrKey: nanoid.customAlphabet("QAZXSWEDCVFRTGBNHYUJMKIOLP0123456789", 12),
            VoucherCode: nanoid.customAlphabet("QAZXSWEDCVFRTGBNHYUJMKIOLP0123456789", 6),

        };
    }

    public async list(conditions) {
        const where: FindOptions<VoucherModel["_attributes"]>["where"] = {};
        const order: FindOptions<VoucherModel["_attributes"]>["order"] = [];

        where.ClientId = conditions.filter.ClientId;
        (conditions.search && (where.SearchVector = literal(`search_vector @@ to_tsquery('${conditions.search.replace(new RegExp(" ", "g"), " & ")}')`)));
        (conditions.filter.status && (where.Status = conditions.filter.status));
        (conditions.filter.location && (where.Locations = {[Op.contains]: `{${conditions.filter.location}}`}));

        if (conditions.filter.dtm) {
            where.ValidStartDtm = {[Op.lte]: moment(conditions.filter.dtm.from).toDate()};
            where.ValidEndDtm = {[Op.gte]: moment(conditions.filter.dtm.to).toDate()};
        }
        if (conditions.sort) {
            order.push([conditions.sort.field || "VoucherId", conditions.sort.dir || "asc"]);
        }

        const result = await this.tasks.Voucher.getListAndCount({
            offset: conditions.skip,
            limit: conditions.limit,
            where: where,
            order: order,
        });

        let [prev, next] = [parseInt(conditions.skip) - parseInt(conditions.limit), parseInt(conditions.skip) + parseInt(conditions.limit)];
        [prev, next] = [(prev >= 0 && prev || 0), (next >= 0 && next || 0)];

        return {
            total: result.count,
            skip: parseInt(conditions.skip),
            prevUrl: `/${Params["api_endpoint"]}/voucher?${querystring.stringify({
                skip: prev,
                limit: parseInt(conditions.limit),
            })}`,
            nextUrl: `/${Params["api_endpoint"]}/voucher?${querystring.stringify({
                skip: next,
                limit: parseInt(conditions.limit),
            })}`,
            results: new Proxy<VoucherModel[]>(result.rows, {
                get(target: VoucherModel[], p: PropertyKey, _receiver: any): any {
                    return typeof target[p] === "object" && {
                        voucher_id: target[p].VoucherId,
                        voucher_code: target[p].VoucherCode,
                        batch_no: target[p].BatchNo,
                        qr_src: target[p].QrSrc,
                        created_dtm: target[p].created_dtm?.getTime(),
                        status: target[p].Status,
                    } || target[p];
                }
            })
        };
    }

    public async one(conditions) {
        const data = await this.tasks.Voucher.getOne({
            where: conditions,
            rejectOnEmpty: false,
            include: [
                this.tasks.Voucher.items(),
                this.tasks.Voucher.transactions(),
            ],
        });

        const voucher = data && <VoucherInterface> data.toJSON();

        if (!voucher) {
            return;
        }
        return {
            voucher_id: voucher.VoucherId,
            batch_no: voucher.BatchNo,
            voucher_code: voucher.VoucherCode,
            qr_src: voucher.QrSrc,
            created_dtm: voucher.CreatedDtm,
            status: voucher.Status,
            locations: voucher.Locations,
            valid_start_dtm: voucher.ValidStartDtm,
            valid_end_dtm: voucher.ValidEndDtm,
            items: new Proxy<ItemInterface>(voucher.items, {
                get(target: ItemInterface, p: PropertyKey, _receiver: any): any {
                    return typeof target[p] === "object" && {
                        item_id: target[p].ItemIndex,
                        quantity: target[p].Quantity,
                    } || target[p];
                }
            }),
            transactions: voucher.transactions,
        };
    }

    public async create(client: ClientInterface, body: VoucherInterface) {
        const voucherCode = this.tasks.VoucherCode();
        const tr = await this.tasks.Voucher.transaction();

        const newVoucher = await this.tasks.Voucher.createOne({
            ClientId: client.ClientId,
            BatchNo: body.BatchNo,
            Locations: body.Locations,
            QrSrc: await this.generateQRCode({
                version: 1,
                voucher_code: voucherCode,
                items: body.items,
                valid_start_dtm: body.ValidStartDtm,
                valid_end_dam: body.ValidEndDtm,
            }),
            Status: "PENDING",
            ValidEndDtm: body.ValidEndDtm,
            ValidStartDtm: body.ValidStartDtm,
            VoucherCode: voucherCode,
        }, {transaction: tr});
        const items = body.items.map((value: any) => ({ItemIndex: value.item_id, Quantity: value.quantity, VoucherId: newVoucher.VoucherId}));
        await this.tasks.Item.createMany(items, {transaction: tr});
        await tr.commit();

        return {
            voucher_id: newVoucher.VoucherId,
            voucher_code: newVoucher.VoucherCode,
            qr_src: `${Params["static_url"]}/${newVoucher.QrSrc}`,
            status: newVoucher.Status,
        };
    }

    public async update(conditions: any, values: any) {
        await this.tasks.Voucher.updateOne(values, {where: conditions});
    }

    public async delete(id: string) {
        await this.tasks.Voucher.updateOne({Status: "VOID"},{where: {VoucherId: id}})
    }

    public async redeemed(id: string) {
        const result = await this.tasks.Voucher.getOne({rejectOnEmpty: true, where: {VoucherId: id}});
        const voucher = <VoucherInterface>result.toJSON();
        // await this.tasks.Voucher.updateOne({Locations: locations}, {where: {VoucherId: id}});
        await this.tasks.Transaction.createOne({
            BatchNo: voucher.BatchNo,
            ClientId: voucher.ClientId,
            CreatedDtm: voucher.CreatedDtm,
            StatusSnapshot: voucher.Status,
            VoucherId: voucher.VoucherId,
        });
    }

    public async location(filter: any, locations: string[]) {
        await this.tasks.Voucher.updateOne({Locations: locations}, {where: filter});
    }

    public async transactions() {

    }

    private async generateQRCode(body): Promise<string> {
        const varsion = body.varsion;
        delete body.version;
        const text = json.stringify(body);
        let fname = this.tasks.QrKey();

        const dataUrl = await qrcode.toDataURL(text, {
            type: "image/png",
            version: varsion
        });
        const {buffer, ext} = this.parseDataUrl(dataUrl);
        fname = `${fname}.${ext}`;
        const fpath = path.join(process.cwd(), Params["static_path"], "qr", fname);
        await writeFile(fpath, buffer, {});

        return fname;
    }

    private parseDataUrl(dataUrl) {
        const regex = /^data:.+\/(.+);base64,(.*)$/;
        const matches = dataUrl.match(regex);
        const [ext, data] = [matches[1], matches[2]];
        const buffer = Buffer.from(data, "base64");

        return {buffer, ext};
    }
}
