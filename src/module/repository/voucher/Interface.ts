import ItemInterface        from "../item/Interface";
import TransactionInterface from "../transaction/Interface";

/**
 * @name Interface
 */
export default interface Interface {
    VoucherId?: string;
    ClientId: string;
    BatchNo: string;
    VoucherCode: string;
    QrSrc: string;
    CreatedDtm?: Date;
    Status: string;
    SearchVector?: any;
    Locations: string[];
    items?: ItemInterface[];
    ValidStartDtm: any;
    ValidEndDtm: any;
    transactions?: TransactionInterface[];
}
