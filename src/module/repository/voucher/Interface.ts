import ItemInterface        from "../item/Interface";
import TransactionInterface from "../transaction/Interface";

/**
 * @name Interface
 */
export default interface Interface {
    VoucherId: string;
    ClientId: string;
    BatchNo: string;
    VoucherCode: string;
    QrSrc: string;
    CreatedDtm: Date;
    Status: string;
    Locations: string[];
    Items: ItemInterface[];
    ValidStartDtm: any;
    ValidEndDtm: any;
    Transactions: TransactionInterface[];
}
