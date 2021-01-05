import chai                   from "chai";
import crypto                 from "crypto";
import { Sequelize, vars }    from "./globals";
import fetch, { RequestInit } from "node-fetch";
import { QueryTypes }         from "sequelize";

export const auth = async () => {
    const mockReq: RequestInit[] = [{
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: makeAuth(`cl1`, `clsc1`),
            Timestamp: `${vars.now}`,
        },
        body: JSON.stringify({
            "grant_type": "password",
            "clientId": `cl1`,
            "clientSecret": `clsc1`,
            "scopes": [
                "voucher.read",
                "voucher.write",
                "voucher.redeem",
                "voucher.void",
                "transaction.read"
            ],
        }),
    }];

    vars.clients = mockReq;
    for await (const reqBody of mockReq) {
        await authTest(reqBody);
    }
};
const authTest = async (reqBody) => {
    const response = await fetch("http://127.0.0.1:5001/api/auth", reqBody);

    const body = await response.json();

    await chai.expect(body.success, JSON.stringify(body.error)).is.true;
    await chai.expect(body.result).is.not.empty;
    await chai.expect(body.result.access_token).to.be.a("string");
    await chai.expect(body.result.expires_in).to.be.a("string");
    await chai.expect(body.result.refresh_token).to.be.a("string");
    await chai.expect(body.result.refresh_token_expires_in).to.be.a("string");
    vars.authResults.push(body.result);

};

export const reset = async () => {
    for await (const authResult of vars.authResults) {
        const mockBody = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: makeAuth(`cl1`, `clsc1`),
                Timestamp: `${vars.now}`,
            },
            body: JSON.stringify({
                "grant_type": "password",
                "refresh_token": authResult.refresh_token
            }),
        };
        await resetTest(mockBody);
    }

};
const resetTest = async (reqBody) => {
    const response = await fetch("http://127.0.0.1:5001/api/auth/token", reqBody);

    const body = await response.json();

    await chai.expect(body.success, JSON.stringify(body.error)).is.false;
    if (body?.error?.message === "Error NotExpired") {
        await chai.expect(body.error.message).to.be.equal("Error NotExpired");
    } else {
        await chai.expect(body.success, JSON.stringify(body.error)).is.true;
        await chai.expect(body.result).is.not.empty;
        await chai.expect(body.result.access_token).to.be.a("string");
        await chai.expect(body.result.expires_in).to.be.a("string");
    }
};

const makeAuth = (clientId: string, clientSecret: string): string => {
    let baseHash = (Buffer.from(`${clientId}:${clientSecret}`)).toString("base64");
    return crypto.createHash("md5").update(baseHash).digest("hex");
};

export const afterTest = async () => {
    await Promise.all(vars.clients.map(value => {
        const body = JSON.parse(value.body);
        return Sequelize.query(`
            delete
            from client
            where "client_index" = $clientId
              and "client_secret" = $clientSecret
        `, {
            type: QueryTypes.DELETE,
            bind: {
                clientId: body.clientId,
                clientSecret: body.clientSecret,
            }
        });
    }));

};
