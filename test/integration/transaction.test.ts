import chai                   from "chai";
import fetch, { RequestInit } from "node-fetch";
import { vars }               from "./globals";

export const transactionList = async () => {
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
                status: "COMPLETED"
            },
            sort: {
                field: "VoucherId",
                dir: "desc"
            },
            "search": "test1"
        }
    }];

    vars.transactions = mockBody;
    for await (const reqBody of mockBody) {
        await transactionListTest(reqBody);
    }
};
const transactionListTest = async (reqBody) => {
    const response = await fetch(`http://127.0.0.1:5001/api/transaction?`, reqBody);

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
                        transaction_id: {
                            type: "string"
                        }
                    },
                    {
                        voucher_id: {
                            type: "string"
                        }
                    },
                    {
                        batch_no: {
                            type: "string",
                        }
                    },
                    {
                        status: {
                            type: "string",
                        }
                    },
                    {
                        created_dtm: {
                            type: "number",
                            format: "date-time"
                        }
                    }
                ],
                // additionalItems: false
            }
        }
    });

    vars.transactionResults.push(...body.result.results);
};

export const afterTest = async () => {
};
