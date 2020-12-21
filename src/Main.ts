import "./lib/utils/global";

import ApplicationRunner from "./lib/abstract/ApplicationRunner";
import Application       from "./lib/decorators/Application";
import { ModuleImpl }    from "./lib/decorators/CModule";
import { modules }       from "./lib/abstract/CModule";
import { error }         from "./lib/utils/Logger";

/**
 * @name Main
 */
@ModuleImpl(...modules)
@Application()
class Main extends ApplicationRunner<Main> {
    /**
     * @name main
     * @return Promise
     */
    async main(): Promise<void> {
        try {
            await Promise.all(this.modules.map(async (value) => await value.init()));
        } catch (e) {
            error(e);
            await this.shutdown();
            process.exit(1);
        }
    }

    /**
     * @name shutdown
     * @return Promise
     */
    async shutdown(): Promise<void> {
        await Promise.all(this.modules.map(value => value.stop()));
    }

}
