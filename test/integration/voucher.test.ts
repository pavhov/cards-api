import ms                     from "ms";
import chai                   from "chai";
import moment                 from "moment";
import fetch, { RequestInit } from "node-fetch";
import { vars }               from "./globals";

export const voucherCreate = async () => {
    const authResult = vars.authResults[0];
    const mockBody: RequestInit[] = [{
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.access_token}`,
        },
        body: JSON.stringify({
            "items": [
                {
                    "item_id": "item1",
                    "quantity": 11
                }
            ],
            "valid_start_dtm": moment().toDate().getTime(),
            "valid_end_dtm": moment().add(ms("10h")).toDate().getTime(),
            "batch_no": "batch_no1",
            "locations": [
                "location1"
            ]
        }),
    }];

    for await (const reqBody of mockBody) {
        await voucherCreateTest(reqBody);
    }
};
const voucherCreateTest = async (reqBody) => {
    const response = await fetch("http://127.0.0.1:5001/api/voucher", reqBody);

    const body = await response.json();

    await chai.expect(body.success, JSON.stringify(body.error)).is.true;
    await chai.expect(body.result).is.not.empty;

    await chai.expect(body.result.voucher_id).to.be.not.empty;
    await chai.expect(body.result.voucher_id).to.be.a("string");

    await chai.expect(body.result.voucher_code).to.be.not.empty;
    await chai.expect(body.result.voucher_code).to.be.a("string");

    await chai.expect(body.result.qr_src).to.be.not.empty;
    await chai.expect(body.result.qr_src).to.be.a("string");

    await chai.expect(body.result.status).to.be.not.empty;
    await chai.expect(body.result.status).to.be.a("string");
    vars.voucherResults.push(body.result);
};

export const voucherList = async () => {
    const authResult = vars.authResults[0];
    const mockBody: RequestInit & { query: any }[] = [{
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.access_token}`,
        },
        query: {
            filter: {
                location: "asdas",
                status: "PENDING"
            },
            sort: {
                field: "VoucherId",
                dir: "desc"
            },
            "search": "3GNH9J"
        }
    }];

    vars.vouchers = mockBody;
    for await (const reqBody of mockBody) {
        await voucherListTest(reqBody);
    }
};
const voucherListTest = async (reqBody) => {
    const response = await fetch(`http://127.0.0.1:5001/api/voucher?`, reqBody);

    const body = await response.json();

    await chai.expect(body.success, JSON.stringify(body.error)).is.true;
    await chai.expect(body.result).is.not.empty;
    await chai.expect(body.result.total).to.be.a("number");
    await chai.expect(body.result.skip).to.be.a("number");
    await chai.expect(body.result.prevUrl).to.be.a("string");
    await chai.expect(body.result.nextUrl).to.be.a("string");
    await chai.expect(body.result.results).to.be.a("array");
    await chai.expect({results: body.result.results}).to.be.jsonSchema({
        properties: {
            type: "object",
            results: {
                type: "array",
                items: [
                    {
                        voucher_id: {
                            type: "string",
                            format: "uuid"
                        }
                    },
                    {
                        voucher_code: {
                            type: "string",
                            length: 6
                        }
                    },
                    {
                        batch_no: {
                            type: "string",
                        }
                    },
                    {
                        qr_src: {
                            type: "string",
                        }
                    },
                    {
                        status: {
                            type: "string",
                        }
                    }
                ],
                // additionalItems: false
            }
        }
    });

    vars.voucherResults.push(...body.result.results);
};

export const voucherOne = async () => {
    const authResult = vars.authResults[0];
    const voucherResults = vars.voucherResults;
    for await (const reqBody of voucherResults) {
        const mockBody: RequestInit = {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authResult.access_token}`,
            },
        };

        await voucherOneTest(mockBody, reqBody.voucher_id);
    }
};
const voucherOneTest = async (reqBody, voucher_id) => {
    const response = await fetch(`http://127.0.0.1:5001/api/voucher/${voucher_id}`, reqBody);

    const body = await response.json();

    await chai.expect(body.success, JSON.stringify(body.error)).is.true;
    await chai.expect(body.result).is.not.empty;
    await chai.expect(body.result.voucher_id).to.be.a("string");
    await chai.expect(body.result.voucher_code).to.be.a("string");
    await chai.expect(body.result.qr_src).to.be.a("string");
    await chai.expect({created_dtm: body.result.created_dtm}).to.be.jsonSchema({
        properties: {
            created_dtm: {
                type: "number",
                format: "date-time"
            }
        }
    });
    await chai.expect(body.result.status).to.be.a("string");
    await chai.expect({locations: body.result.locations}).to.be.jsonSchema({
        properties: {
            locations: {
                type: "array",
                items: "string",
            }
        }
    });
    await chai.expect({created_dtm: body.result.valid_start_dtm}).to.be.jsonSchema({
        properties: {
            valid_start_dtm: {
                type: "string",
                format: "date-time"
            }
        }
    });
    await chai.expect({created_dtm: body.result.valid_end_dtm}).to.be.jsonSchema({
        properties: {
            valid_end_dtm: {
                type: "string",
                format: "date-time"
            }
        }
    });
    await chai.expect({items: body.result.items}).to.be.jsonSchema({
        properties: {
            items: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        item_id: {
                            type: "string",
                        },
                        quantity: {
                            type: "number",
                        }
                    }
                }
            }
        }
    });
};

export const voucherRedeemed = async () => {
    const authResult = vars.authResults[0];
    const voucherResults = vars.voucherResults;
    for await (const reqBody of voucherResults) {
        const mockBody: RequestInit = {
            method: "patch",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authResult.access_token}`,
            },
        };

        await voucherRedeemedTest(mockBody, reqBody.voucher_id);
    }
};
const voucherRedeemedTest = async (reqBody, voucher_id) => {
    const response = await fetch(`http://127.0.0.1:5001/api/voucher/${voucher_id}/redeemed`, reqBody);

    await chai.expect(response.status).to.be.equal(204);
};

export const voucherLocation = async () => {
    const authResult = vars.authResults[0];
    const voucherResults = vars.voucherResults;
    for await (const reqBody of voucherResults) {
        const mockBody: RequestInit = {
            method: "patch",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authResult.access_token}`,
            },
        };

        await voucherLocationTest(mockBody, reqBody.voucher_id);
    }
};
const voucherLocationTest = async (reqBody, voucher_id) => {
    const response = await fetch(`http://127.0.0.1:5001/api/voucher/${voucher_id}/location`, reqBody);

    await chai.expect(response.status).to.be.equal(204);
};

export const voucherVoid = async () => {
    const authResult = vars.authResults[0];
    const voucherResults = vars.voucherResults;
    for await (const reqBody of voucherResults) {
        const mockBody: RequestInit = {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authResult.access_token}`,
            },
        };

        await voucherVoidTest(mockBody, reqBody.voucher_id);
    }
};
const voucherVoidTest = async (reqBody, voucher_id) => {
    const response = await fetch(`http://127.0.0.1:5001/api/voucher/${voucher_id}`, reqBody);

    await chai.expect(response.status).to.be.equal(204);
};

export const afterTest = async () => {
};
