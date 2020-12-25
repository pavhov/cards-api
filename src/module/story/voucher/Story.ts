import fs        from "fs";
import util      from "util";
import * as path from "path";
import qrcode    from "qrcode";
import nanoid    from "nanoid";

import Params   from "../../../lib/utils/config/Params";
import { json } from "../../../lib/utils/json/Parser";

import ItemTask         from "../../repository/item/Task";
import VoucherTask      from "../../repository/voucher/Task";
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
            QrKey: nanoid.customAlphabet("QAZXSWEDCVFRTGBNHYUJMKIOLP0123456789", 12),
            VoucherCode: nanoid.customAlphabet("QAZXSWEDCVFRTGBNHYUJMKIOLP0123456789", 6),

        };
    }

    public async list(conditions) {
        return await this.tasks.Voucher.getList({
            offset: conditions.skip,
            limit: conditions.limit,
            // where: {
            //     [Op.like]: conditions.search,
            //
            // }
            //todo: will continue
        });
    }

    public async one() {

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
                items: body.Items,
                valid_start_dtm: body.ValidStartDtm,
                valid_end_dam: body.ValidEndDtm,
            }),
            Status: "PENDING",
            ValidEndDtm: body.ValidEndDtm,
            ValidStartDtm: body.ValidStartDtm,
            VoucherCode: voucherCode,
        }, {transaction: tr});
        const items = body.Items.map((value: any) => ({ItemIndex: value.item_id, Quantity: value.quantity, VoucherId: newVoucher.VoucherId}));
        await this.tasks.Item.createMany(items, {transaction: tr});
        await tr.commit();

        return {
            voucher_id: newVoucher.VoucherId,
            voucher_code: newVoucher.VoucherCode,
            qr_src: `${Params["static_url"]}/${newVoucher.QrSrc}`,
            status: newVoucher.Status,
        };
    }

    public async update() {

    }

    public async delete() {

    }

    public async redeemed() {

    }

    public async location() {

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
