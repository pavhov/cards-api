import json from "json5";
// import { error } from "./../logger";

/**
 * @name parse
 * @param text
 * @param reviver
 */
const parse = (text: string, reviver?: (this: any, key: string, value: any) => any): any => {
    try {
        return json.parse(text, reviver);
    } catch (e) {
        // error("JSON.parse:error", e);
    }
    return null;
};

/**
 * @name stringify
 * @param value
 * @param replacer
 * @param space
 */
const stringify = (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string => {
    try {
        return json.stringify(value, replacer, space);
    } catch (e) {
        // error("JSON.stringify:error", e);
    }
    return null;
};

export const json5 = {parse, stringify};
