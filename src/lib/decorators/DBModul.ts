import { staticModules } from "../abstract/CModule";

/**
 * @name DBModuleInIt
 * @param constructor
 * @constructor
 */
export function DBModuleInIt<T extends { new(...args: any[]): {} }>(constructor: T) {
    staticModules.push(constructor);
}
