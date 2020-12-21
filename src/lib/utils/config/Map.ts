import * as fs    from "fs";
import * as path  from "path";
import * as json5 from "json5";

const conf = json5.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "..", "config_map", "conf.json5")).toString("utf8"));

export default conf;
