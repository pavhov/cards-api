import Koa from "koa";

import CModule       from "./../../../lib/abstract/CModule";
import { ModuleInt } from "../../../lib/decorators/CModule";
import Params     from "./../../../lib/utils/config/Params";
import { KoaApi } from "../../../lib/decorators/Koa";
import { info }   from "../../../lib/utils/Logger";

/**
 * @name Http
 */
@ModuleInt
@KoaApi({path: "/"})
export default class Http extends CModule {
    /**
     * @name koa
     * @private
     */
    private koa: Koa.DefaultContext;

    /**
     * @name ip
     * @private
     */
    private readonly ip: string;

    /**
     * @name port
     * @private
     */
    private readonly port: number;

    /**
     * @name Http
     */
    public constructor() {
        super();

        this.ip = Params["api_http_ip"];
        this.port = parseInt(Params["api_http_port"]);
    }

    /**
     * @name context
     * @protected
     */
    protected async context(): Promise<void> {
        this.koa.listen(this.port, this.ip, (...args) => {
            info(`Koa listening on http://${this.ip}:${this.port}`);
        });
        return Promise.resolve(undefined);
    }

    /**
     * @name destroy
     * @protected
     */
    protected async destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
