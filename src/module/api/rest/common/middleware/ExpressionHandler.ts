import { Context, Next } from "koa";
import HttpError         from "./../../../../../lib/error/HttpError";
import { error }         from "../../../../../lib/utils/Logger";

export const ExpressionHandler = async (ctx: Context, next: Next) => {
    try {
        await next();
        const body = ctx.body;
        if (body) {
            ctx.body = {
                success: true,
                result: body,
            };
        }
    } catch (e) {
        ctx.status = parseInt(e.code || e.status) || 400;
        ctx.body = new HttpError(`${e.name} ${e.message}`, ctx.status).toJSON();
        const stackSlice = e.stack.split("\n");
        error("Expression:", "status:", ctx.status, "message:", e.message, "stack:", (stackSlice.length && JSON.stringify(stackSlice.splice(1, 4)).replace(new RegExp(" {2}", "gm"), "")));
    }
};
