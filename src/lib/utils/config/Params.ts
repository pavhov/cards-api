import configMap from "./Map";
import { json }  from "./../json/Parser";

const Params: any = {
    params: {} as any
};

/**
 * @name parse
 */
const parse = () => {
    for (let name in configMap) {
        if (configMap.hasOwnProperty(name)) {
            let config = configMap[name];
            merge(configMap, config, name);
        }
    }
};

/**
 * @name get
 * @param key
 */
const get = (key: string): string => {
    let env = process.env;
    if (env[key] !== undefined) {
        return env[key] || null;
    }
    return null;
};

/**
 * @name set
 * @param configs
 * @param name
 * @param joinedKey
 */
const set = (configs: any, name: string, joinedKey: string) => {
    let data = get(joinedKey);
    if (data) {
        configs[name] = data;
    }
    Params.params[joinedKey] = (json.parse(configs) || configs)[name];
};

/**
 * @name merge
 * @param configs
 * @param config
 * @param name
 * @param joinedKey
 */
const merge = (configs: any, config: any, name?: string, joinedKey?: string) => {
    if (!joinedKey) {
        joinedKey = name;
    } else {
        joinedKey = `${joinedKey}_${name}`;
    }
    if (!(typeof config === "object")) {
        set(configs, name, joinedKey);
    } else if (typeof config === "object") {
        for (let sub_name in config) {
            if (config.hasOwnProperty(sub_name)) {
                let config = configs[name];
                set(configs, name, joinedKey);
                if (config) {
                    merge(configs[name], config[sub_name], sub_name, joinedKey);
                }
            }
        }
    }
};

parse();

export default Params.params;
