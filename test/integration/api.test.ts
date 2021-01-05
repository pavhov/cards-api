import "./globals";
import "./auth.test";
import "./voucher.test";
import {
    auth,
    reset,
    afterTest as afterAuthTest
} from "./auth.test";
import {
    voucherCreate,
    voucherList,
    voucherLocation,
    voucherOne,
    voucherRedeemed,
    voucherVoid,
    afterTest as afterVoucherTest
} from "./voucher.test";
import {
    transactionList
} from "./transaction.test";


describe("Api integration tests", () => {
    test("Auth action", auth);
    test("Reset action", reset);
    test("Voucher create action", voucherCreate);
    test("Voucher list action", voucherList);
    test("Voucher one action", voucherOne);
    test("Voucher redeemed action", voucherRedeemed);
    test("Voucher location action", voucherLocation);
    test("Voucher void action", voucherVoid);
    test("Transaction action", transactionList);
    afterAll(async () => {
        try {
            await afterAuthTest();
            await afterVoucherTest();
        } catch (e) {
            console.log(e);
        }
    });
});
