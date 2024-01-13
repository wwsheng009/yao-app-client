//    ArrayPluck 将多个数据记录集合，合并为一个数据记录集合
//		columns: ["城市", "行业", "计费"]
//		pluck: {
//			"行业":{"key":"city", "value":"数量", "items":[{"city":"北京", "数量":32},{"city":"上海", "数量":20}]},
//			"计费":{"key":"city", "value":"计费种类", "items":[{"city":"北京", "计费种类":6},{"city":"西安", "计费种类":3}]},
//	 }
//
// return: [
//
//	{"城市":"北京", "行业":32, "计费":6},
//	{"城市":"上海", "行业":20, "计费":null},
//	{"城市":"西安", "行业":null, "计费":6}

/**
 * ArrayPluck 将多个数据记录集合，合并为一个数据记录集合
 * @param columns
 * @param pluck
 * @returns
 */
export function arrayPluck(
  columns: string[],
  pluck: { [key: string]: any }
): { [key: string]: any }[] {
  if (columns.length < 2) {
    throw new Error("ArrayPluck 参数错误, 应至少包含两列。");
  }

  const primary = columns[0];
  const data: { [key: string]: { [key: string]: any } } = {};

  // 解析数据
  for (const [name, value] of Object.entries(pluck)) {
    // name="行业", value={"key":"city", "value":"数量", "items":[{"city":"北京", "数量":32},{"city":"上海", "数量":20}]},
    const arg = ofArrayPluckValue(value);
    for (const item of arg.items) {
      // item = [{"city":"北京", "数量":32},{"city":"上海", "数量":20}]
      if (item.hasOwnProperty(arg.key)) {
        // arg.Key = "city"
        const v = item[arg.key]; // v = "北京"
        const key = `${v}`; // key = "北京"
        const val = item[arg.value]; // arg.Value = "数量",  val = 32
        if (!data.hasOwnProperty(key)) {
          data[key] = {}; // {`"北京"`: {}}
          data[key][primary] = v; // {`"北京"`: {"城市":"北京"}}
        }
        data[key][name] = val; // {`"北京"`: {"城市":"北京", "行业":32}}
      }
    }
  }

  // 空值处理
  const res: { [key: string]: any }[] = [];
  for (const key of Object.keys(data)) {
    // key = `"北京"`
    for (const name of columns) {
      // name = "行业"
      if (!data[key].hasOwnProperty(name)) {
        data[key][name] = null;
      }
    }
    res.push(data[key]);
  }

  return res;
}

export function ofArrayPluckValue(value: any) {
  return {
    key: value.key,
    value: value.value,
    items: value.items,
  };
}
// ArraySplit 将多条数记录集合，分解为一个 columns:[]string 和 values: [][]interface{}
// 输入：
// [ { name: "阿里云计算有限公司", short_name: "阿里云" },
//   { name: "世纪互联蓝云", short_name: "上海蓝云" },
// ]
// 输出
// [["name","short_name"],[["阿里云计算有限公司","阿里云"],["世纪互联蓝云","上海蓝云"]]]

export function arraySplit(
  records: { [key: string]: any }[]
): [string[], any[][]] {
  const columns: string[] = [];
  const values: any[][] = [];

  if (records.length === 0) {
    return [columns, values];
  }

  for (const column in records[0]) {
    columns.push(column);
  }

  for (const record of records) {
    const value: any[] = [];

    for (const key of columns) {
      value.push(record[key]);
    }

    values.push(value);
  }

  return [columns, values];
}

// ArrayColumn 返回多条数据记录，指定字段数值。
export function arrayColumn(
  records: { [key: string]: any }[],
  name: string
): any[] {
  const values: any[] = [];
  for (const record of records) {
    values.push(record[name]);
  }
  return values;
}

// ArrayKeep 仅保留指定键名的数据
export function arrayKeep(
  records: { [key: string]: any }[],
  keeps: string[]
): { [key: string]: any }[] {
  const values: { [key: string]: any }[] = [];
  for (const record of records) {
    const value: { [key: string]: any } = {};
    for (const keep of keeps) {
      value[keep] = record[keep];
    }
    values.push(value);
  }
  return values;
}

// ArrayUnique 数组排重
export function arrayUnique(columns: any[]): any[] {
  const res: any[] = [];
  const m: { [key: string]: boolean } = {};
  for (const val of columns) {
    const key: string = `${val}`;
    if (!m[key]) {
      m[key] = true;
      res.push(val);
    }
  }
  return res;
}

// ArrayStringUnique 数组排重
export function arrayStringUnique(columns: string[]): string[] {
  let res: string[] = [];
  let m: { [key: string]: boolean } = {};

  for (let key of columns) {
    if (!m[key]) {
      m[key] = true;
      res.push(key);
    }
  }
  return res;
}

// ArrayTreeOption Array转树形结构参数表
interface ArrayTreeOption {
  key: string; // 主键名称, 默认为 id
  empty: any; // Top节点 parent 数值, 默认为 0
  parent: string; // 父节点字段名称, 默认为 parent
  children: string; // 子节点字段名称, 默认为 children
}

// NewArrayTreeOption 创建配置
export function NewArrayTreeOption(
  option: {
    [key: string]: any;
  } = {
    empty: 0,
    key: "id",
    parent: "parent",
    children: "children",
  }
): ArrayTreeOption {
  const newOption: ArrayTreeOption = {
    empty: 0,
    key: "id",
    parent: "parent",
    children: "children",
  };

  if (option["empty"]) {
    newOption.empty = option["empty"];
  }

  if (typeof option["parent"] === "string") {
    newOption.parent = option["parent"];
  }

  if (typeof option["primary"] === "string") {
    newOption.key = option["primary"];
  }

  if (typeof option["children"] === "string") {
    newOption.children = option["children"];
  }
  return newOption;
}

// ArrayTree []map[string]interface{} 转树形结构
export function ArrayTree(
  records: { [key: string]: any }[],
  setting: { [key: string]: any }
): { [key: string]: any }[] {
  const opt: ArrayTreeOption = NewArrayTreeOption(setting);
  return Tree(records, opt);
}

// Tree Array 转换为 Tree
function Tree(
  records: { [key: string]: any }[],
  opt: ArrayTreeOption
): { [key: string]: any }[] {
  const mapping: { [key: string]: { [key: string]: any } } = {};
  for (let i = 0; i < records.length; i++) {
    if (records[i][opt.key]) {
      const primary = `${records[i][opt.key]}`;
      mapping[primary] = {};
      mapping[primary][opt.children] = [];
      for (const [k, v] of Object.entries(records[i])) {
        mapping[primary][k] = v;
      }
    }
  }

  // 向上归集
  for (const [key, record] of Object.entries(mapping)) {
    const parent = `${record[opt.parent]}`;
    const empty = `${opt.empty}`;
    if (parent === empty) {
      // 第一级
      continue;
    }
    const pKey = `${parent}`;
    if (!mapping[pKey]) {
      continue;
    }
    let children = mapping[pKey][opt.children] as { [key: string]: any }[];
    if (!Array.isArray(children)) {
      children = [];
    }
    children.push(mapping[key]);
    mapping[pKey][opt.children] = children;
  }

  const res: { [key: string]: any }[] = [];
  for (let i = 0; i < records.length; i++) {
    if (records[i][opt.key]) {
      const record = mapping[`${records[i][opt.key]}`];
      if (record[opt.parent]) {
        const parent = `${record[opt.parent]}`;
        const empty = `${opt.empty}`;
        if (parent === empty) {
          // 父类为空
          res.push(record);
        } else if (!mapping[parent]) {
          // 或者父类为定义的
          res.push(record);
        }
      }
    }
  }
  return res;
}

export type MapT = { [key: string]: any };

// ArrayMapSet []MapT 设定数值
export function ArrayMapSet(records: MapT[], key: string, value: any): MapT[] {
  const res: MapT[] = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    record[key] = value;
    res.push(record);
  }
  return res;
}

// ArrayMapSetMapStr []MapT 设定数值
export function ArrayMapSetMapStr(
  records: MapT[],
  key: string,
  value: any
): MapT[] {
  const res: MapT[] = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    record[key] = value;
    res.push(record);
  }
  return res;
}
