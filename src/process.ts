import {
  arrayColumn,
  arrayPluck,
  arraySplit,
  arrayKeep,
  ArrayTree,
  arrayUnique,
  type MapT,
  ArrayMapSet,
  ArrayMapSetMapStr,
} from "./array";

let ProcessList: { [key: string]: Function } = {
  "utils.fmt.print": (args: any[]) => JSON.stringify(args),
  "utils.str.concat": (args: any[]) => args.join(""),
  "utils.str.join": (arg1: any, arg2: any) => arg1.join(arg2),
  "utils.str.joinpath": (args: any[]) => args.join("/"),
  "yao.sys.sleep": function (time: number) {
    var waitTill = new Date(new Date().getTime() + time);
    while (waitTill > new Date()) {}
  },
  "utils.tree.Flatten": processFlatten,

  "utils.arr.Get": processArry,
  "utils.arr.Indexes": processArry,
  "utils.arr.Pluck": processArry,
  "utils.arr.Split": processArry,
  "utils.arr.Column": processArry,
  "utils.arr.Keep": processArry,
  "utils.arr.Tree": processArry,
  "utils.arr.Unique": processArry,
  "utils.arr.MapSet": processArry,

  "utils.map.Keys": processMap,
  "utils.map.Values": processMap,
  "utils.map.Array": processMap,
  "utils.map.Get": processMap,
  "utils.map.Set": processMap,
  "utils.map.Del": processMap,
  "utils.map.DelMany": processMap,
};
export function getProcess(processor: string): Function | undefined {
  const method = processor.toLocaleLowerCase();
  const fn = ProcessList[method];
  if (fn != null) {
    return fn;
  }
  // encoding
  if (method.startsWith("encoding.")) {
    return processEncoding;
  }
  // now
  if (method.startsWith("utils.now.")) {
    return processTime;
  }

  // Map
  // if (method.startsWith("utils.map") || method.startsWith("xiang.helper.map")) {
  //   return processMap;
  // }
  // Array
  // if (
  //   method.startsWith("utils.arr") ||
  //   method.startsWith("xiang.helper.array")
  // ) {
  //   return processArry;
  // }
}

// export function Process<T>(method: `models.${string}.Get`, QueryParam: YaoQueryParam.QueryParam): Promise<Array<T>>;
// export function Process<T>(method: `models.${string}.Find`, id: string | number, QueryParam: YaoQueryParam.QueryParam): Promise<T>;
// export function Process<T>(method: `models.${string}.Paginate`, QueryParam: YaoQueryParam.QueryParam, page: number, pagesize: number): Promise<Paginate<T>>;

// export function Process(method: "utils.app.Ping"): { enging: string, version: string };
// export function Process(method: `scripts.${string}`, ...args: any[]): void;
// export function Process(method: `studio.${string}`, ...args: any[]): void;
// export function Process(method: `services.${string}`, ...args: any[]): void;

// Convert a hex string to a byte array
function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  }
  return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes: number[]) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xf).toString(16));
  }
  return hex.join("");
}

function processEncoding(method: string, ...args: any[]) {
  const process = method.toLowerCase();
  if ("encoding.hex.encode" == process) {
    return bytesToHex(args[0]);
  }
  if ("encoding.hex.decode" == process) {
    return hexToBytes(args[0]);
  }
  if ("encoding.json.encode" == process) {
    return JSON.stringify(args[0]);
  }
  if ("encoding.json.decode" == process) {
    return JSON.parse(args[0]);
  }
  if ("encoding.base64.encode" == process) {
    let buff = Buffer.from(args[0]);
    return buff.toString("base64");
  }
  if ("encoding.base64.decode" == process) {
    let buff = Buffer.from(args[0], "base64");
    return buff.toString();
  }
  // return RemoteRequest({ type: "Process", method: method, args });
}
function processTime(method: string, ...args: any[]) {
  const process = method.toLowerCase();
  if ("utils.now.date" == process) {
    let dateBj = new Date();
    const offset = dateBj.getTimezoneOffset();
    dateBj = new Date(dateBj.getTime() - offset * 60 * 1000);
    return dateBj.toISOString().split("T")[0];
  }
  if ("utils.now.datetime" == process) {
    let dateBj = new Date();
    const offset = dateBj.getTimezoneOffset();
    dateBj = new Date(dateBj.getTime() - offset * 60 * 1000);
    return dateBj.toISOString().slice(0, 19).replace("T", " ");
  }

  if ("utils.now.time" == process) {
    let dateBj = new Date();
    return dateBj.toLocaleTimeString("en-US", { hour12: false });
  }

  if ("utils.now.timestamp" == process) {
    return Math.floor(Date.now() / 1000);
  }
  if ("utils.now.timestampms" == process) {
    return new Date().getTime();
  }
  // return RemoteRequest({ type: "Process", method: method, args });
}

function processMap(method: string, ...args: any[]) {
  let process = method.toLowerCase();
  //参数1是object，参数2是key
  if (["xiang.helper.mapget", "utils.map.get"].includes(process)) {
    return args[0][args[1]];
  }
  //参数1是object，参数2是key,参数3是值
  if (["xiang.helper.mapset", "utils.map.set"].includes(process)) {
    args[0][args[1]] = args[2];
    return args[0];
  }
  //参数1是object，参数2是key
  if (
    ["xiang.helper.mapdel", "utils.map.del", "utils.map.delmany"].includes(
      process
    )
  ) {
    let [record, ...keys] = args as unknown as [
      {
        record: { [id: string]: object };
      }
    ];
    if (Array.isArray(keys)) {
      for (const key of keys) {
        delete record[key];
      }
      return record;
    }
  }

  //参数1是object
  if (["xiang.helper.mapkeys", "utils.map.keys"].includes(process)) {
    return Object.keys(args[0]);
  }
  //参数1是object
  if (["xiang.helper.mapvalues", "utils.map.values"].includes(process)) {
    return Object.values(args[0]);
  }

  if (["utils.map.merge"].includes(process)) {
    let obj = {};
    Object.assign(obj, args[0], args[1]);
    return obj;
  }

  if (["xiang.helper.maptoarray", "utils.map.array"].includes(process)) {
    let res = [] as { key: string; value: object }[];
    for (const key in args[0]) {
      res.push({
        key: key,
        value: args[0][key],
      });
    }
    return res;
  }

  // return RemoteRequest({ type: "Process", method: method, args });
}

function processArry(method: string, ...args: any[]) {
  let process = method.toLowerCase();
  if (["xiang.helper.arrayget", "utils.arr.get"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return args[0][args[1]];
  }
  if (["xiang.helper.arrayindexes", "utils.arr.indexes"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return args[0].map((_v, indx) => indx);
  }

  //将多个数据记录集合，合并为一个数据记录集合
  if (["xiang.helper.arraypluck", "utils.arr.pluck"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return arrayPluck(args[0], args[1]);
  }

  //将多条数记录集合，分解为一个 columns:[]string 和 values: [][]interface{}
  if (["xiang.helper.arraysplit", "utils.arr.split"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return arraySplit(args[0]);
  }

  if (["xiang.helper.arraycolumn", "utils.arr.column"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return arrayColumn(args[0], args[1]);
  }

  if (["xiang.helper.arraykeep", "utils.arr.keep"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return arrayKeep(args[0], args[1]);
  }

  if (["xiang.helper.arraytree", "utils.arr.tree"].includes(process)) {
    if (!Array.isArray(args[0])) {
      throw Error("参数1必须是数组");
    }
    return ArrayTree(args[0], args[1]);
  }

  if (["xiang.helper.arrayunique", "utils.arr.unique"].includes(process)) {
    if (args.length !== 1) {
      throw new Error("参数错误");
    }
    if (Array.isArray(args[0])) {
      return arrayUnique(args[0]);
    }
    return args[0];
  }
  if (["xiang.helper.arraymapset", "utils.arr.mapset"].includes(process)) {
    const arr = args[0] as MapT[];
    if (arr) {
      return ArrayMapSet(arr, args[1], args[2]);
    } else {
      const arr2 = args[0] as MapT[];
      if (arr2) {
        return ArrayMapSetMapStr(arr2, args[1], args[2]);
      }
    }
    return args[0];
  }
}

// ProcessFlatten utils.tree.Flatten cast to array
function processFlatten(...args: any[]): any {
  if (args.length < 1) {
    throw new Error("参数错误");
  }
  const array: any[] = args[0];
  const option: { [key: string]: any } = args[1] || {};
  if (!option.hasOwnProperty("primary")) {
    option.primary = "id";
  }
  if (!option.hasOwnProperty("children")) {
    option.children = "children";
  }
  if (!option.hasOwnProperty("parent")) {
    option.parent = "parent";
  }

  return flatten(array, option, null);
}

function flatten(array: any[], option: { [key: string]: any }, id: any): any[] {
  const parent: string = `${option.parent}`;
  const primary: string = `${option.primary}`;
  const childrenField: string = `${option.children}`;
  const res: any[] = [];
  for (const v of array) {
    const row: { [key: string]: any } = v as { [key: string]: any };
    if (!row) {
      continue;
    }
    if (!(row instanceof Object)) {
      continue;
    }
    row[parent] = id;
    const children: any[] = row[childrenField] as any[];
    delete row[childrenField];
    res.push(row);

    if (children) {
      res.push(...flatten(children, option, row[primary]));
    }
  }
  return res;
}
