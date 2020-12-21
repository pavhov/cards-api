import ApplicationRunner from "./../abstract/ApplicationRunner";

import "./../../module";

/**
 * @name Application
 * @constructor
 */
export default function Application() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const impl = constructor as any;

        if (impl.instance) {
            (impl.instance as ApplicationRunner<T>).main();
            return;
        }

        impl.instance = ((new impl()) as ApplicationRunner<T>);
        setImmediate(async () => {
            await impl.instance.main();
        });
    };
}
