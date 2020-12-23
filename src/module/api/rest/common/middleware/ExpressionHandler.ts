import { Context, Next } from "koa";
import HttpError from "./../../../../../lib/error/HttpError";
import { error } from "../../../../../lib/utils/Logger";

export const ExpressionHandler = async (ctx: Context, next: Next) => {
    try {
        await next();
        const body = ctx.body;
        ctx.body = {
            success: true,
            result: body,
        };
        if (!body) {
            ctx.status = 404;
            ctx.body.success = false;
            ctx.body = new HttpError("Not found", ctx.status).toJSON();
        }
    } catch (e) {
        ctx.status = parseInt(e.code) || 400;
        ctx.body = new HttpError(e.message, ctx.status).toJSON();
        const stackSlice = e.stack.split("\n");
        error("Expression:", "status:", ctx.status, "message:", e.message, "stack:", (stackSlice.length && JSON.stringify(stackSlice.splice(1, 2)).replace(new RegExp(" {2}", "gm"), "")));
    }
};
