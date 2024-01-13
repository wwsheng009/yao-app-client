import { YaoRecord } from "./types/yao";
import type { YaoApplication } from "./yao";

export interface CaptchaOption {
  width?: string;
  height?: string;
  lenght?: string;
  type?: string;
  background?: string;
  lang?: string;
}
export interface CaptchaContent {
  id: number;
  content: string;
}
export interface FlattenOption {
  primary?: string;
  children?: string;
  parent?: string;
}
export interface JwtToken {
  token: string;
  expires_at: number;
}
export interface JwtOption {
  subject?: string;
  audience?: string;
  issuer?: string;
  sid?: string;
  timeout?: number;
  expires_at?: number;
}
export interface JwtClaims {
  id: string;
  sid: string;
  data: YaoRecord;
  aud?: string;
  exp?: number;
  jti?: string;
  iat?: number;
  iss?: string;
  nbf?: number;
  sub?: string;
}

class Base {
  static with<T extends typeof Base>(this: T, c: YaoApplication): T {
    Base.client = c;
    return this; // Return the class itself
  }
  static client: YaoApplication;
}
class Now extends Base {
  /**
   * get the timestamp in seconds in unix format
   * @returns
   */
  static Timestamp() {
    return this.client.Process<number>(`utils.now.timestamp`);
  }
  /**
   * get the timestamp in micro seconds in unix format
   * @returns
   */
  static Timestampms() {
    return this.client.Process<number>(`utils.now.timestampms`);
  }
  static Date() {
    return this.client.Process<string>(`utils.now.Date`);
  }
  static DateTime() {
    return this.client.Process<string>(`utils.now.DateTime`);
  }
  static Time() {
    return this.client.Process<string>(`utils.now.Time`);
  }
}

class Session extends Base {
  static ID(): Promise<string> {
    return this.client.Process(`session.id`);
  }
  static Get(id: string, sesstionId?: string): Promise<string> {
    return this.client.Process(`session.Get`, id, sesstionId);
  }
  static Del(id: string, sesstionId?: string): Promise<string> {
    return this.client.Process(`session.Del`, id, sesstionId);
  }

  static Set(
    id: string,
    key: string,
    value: any,
    sesstionId?: string
  ): Promise<string> {
    return this.client.Process(`session.Set`, id, sesstionId, key, value);
  }
  static Dump(): Promise<YaoRecord> {
    return this.client.Process(`session.Dump`);
  }
  static GetMany(ids: string[], sesstionId?: string): Promise<string> {
    return this.client.Process(`session.GetMany`, ids, sesstionId);
  }
  static SetMany(
    obj: YaoRecord,
    timeout: number,
    sesstionId?: string
  ): Promise<string> {
    return this.client.Process(`session.SetMany`, obj, timeout, sesstionId);
  }
  static DelMany(ids: string[], sesstionId?: string): Promise<string> {
    return this.client.Process(`session.DelMany`, ids, sesstionId);
  }
}
class Arr extends Base {
  /**
   * ArrayPluck 将多个数据记录集合，合并为一个数据记录集合
   * @param columns
   * @param pluck
   * @returns
   */
  static Pluck(
    columns: string[],
    pluck: { [key: string]: any }
  ): Promise<Array<YaoRecord>> {
    return this.client.Process<Array<YaoRecord>>(
      `utils.arr.Pluck`,
      columns,
      pluck
    );
  }

  /**
   * Split 将多条数记录集合，分解为一个 columns:[]string 和 values: [][]interface{}
   * 输入：
   * [ { name: "阿里云计算有限公司", short_name: "阿里云" },
   *   { name: "世纪互联蓝云", short_name: "上海蓝云" },
   * ]
   * 输出
   * [["name","short_name"],[["阿里云计算有限公司","阿里云"],["世纪互联蓝云","上海蓝云"]]]
   * @param records
   * @returns
   */
  static Split(
    records: { [key: string]: any }[]
  ): Promise<[string[], any[][]]> {
    return this.client.Process<[string[], any[][]]>(`utils.arr.Split`, records);
  }
  /**
   * 转树形结构
   * @returns
   */
  static Tree(
    records: Array<YaoRecord>,
    setting?: YaoRecord
  ): Promise<Array<YaoRecord>> {
    return this.client.Process<Array<YaoRecord>>(
      `utils.arr.Tree`,
      records,
      setting
    );
  }
  static Indexes(array: Array<any>) {
    return this.client.Process<string>(`utils.arr.Indexes`, array);
  }

  static Get(array: Array<any>, index: number) {
    return this.client.Process<string>(`utils.arr.Get`, array, index);
  }
  /**
   * 仅保留指定键名的数据
   * @param records
   * @param keeps
   * @returns
   */
  static Keep(
    records: Array<YaoRecord>,
    keeps: string[]
  ): Promise<Array<YaoRecord>> {
    return this.client.Process<Array<YaoRecord>>(
      `utils.arr.Keep`,
      records,
      keeps
    );
  }
  /**
   * 数组排除重复
   * @param records
   * @returns
   */
  static Unique(records: Array<YaoRecord>): Promise<Array<YaoRecord>> {
    return this.client.Process<Array<YaoRecord>>(`utils.arr.Unique`, records);
  }

  /**
   * update all the mapset records with special key and value
   * @param records
   * @param key
   * @param value
   * @returns
   */
  static MapSet(
    records: Array<YaoRecord>,
    key: string,
    value: any
  ): Promise<Array<YaoRecord>> {
    return this.client.Process<Array<YaoRecord>>(
      `utils.arr.MapSet`,
      records,
      key,
      value
    );
  }

  static Column(
    records: Array<YaoRecord>,
    name: string
  ): Promise<Array<YaoRecord>> {
    return this.client.Process<Array<YaoRecord>>(
      `utils.arr.Column`,
      records,
      name
    );
  }
}

class YaoMap extends Base {
  static Get(record: YaoRecord, key: string): Promise<YaoRecord> {
    return this.client.Process<YaoRecord>(`utils.map.get`, record, key);
  }

  static Set(record: YaoRecord, key: string, value: any): Promise<YaoRecord> {
    return this.client.Process<YaoRecord>(`utils.map.Set`, record, key, value);
  }

  static Del(record: YaoRecord, key: string): Promise<YaoRecord> {
    return this.client.Process<YaoRecord>(`utils.map.Del`, record, key);
  }
  static Delmany(record: YaoRecord, keys: string[]): Promise<YaoRecord> {
    return this.client.Process<YaoRecord>(`utils.map.delmany`, record, keys);
  }

  static Keys(record: YaoRecord): Promise<string[]> {
    return this.client.Process<string[]>(`utils.map.Keys`, record);
  }

  static Values(record: YaoRecord): Promise<any[]> {
    return this.client.Process<any[]>(`utils.map.Values`, record);
  }

  static Merge(record: YaoRecord, record2: YaoRecord): Promise<YaoRecord> {
    return this.client.Process<YaoRecord>(`utils.map.Merge`, record, record2);
  }

  /**
   * convert map object, extra the values to array
   * @param record
   * @returns
   */
  static Array(record: YaoRecord): Promise<any[]> {
    return this.client.Process<any[]>(`utils.map.Array`, record);
  }
}

class Captcha extends Base {
  /**
   * 创建一个认证码图片
   * @param option
   * @returns
   */
  static Make(
    option: CaptchaOption = {
      width: "240",
      height: "80",
      lenght: "6",
      type: "math",
      background: "#FFFFFF",
      lang: "zh",
    }
  ): Promise<CaptchaContent> {
    return this.client.Process<CaptchaContent>(`utils.captcha.Make`, option);
  }
  /**
   * 检查验证码图片是否正确
   * @param id
   * @param code
   * @returns
   */
  static Verify(id: string, code: string): Promise<boolean> {
    return this.client.Process<boolean>(`utils.captcha.Verify`, id, code);
  }
}

class Str extends Base {
  static Concat(str: string, str2: string): Promise<string> {
    return this.client.Process<string>(`utils.str.Concat`, str, str2);
  }

  static Join(strs: string[], sep: string): Promise<string> {
    return this.client.Process<string>(`utils.str.Join`, strs, sep);
  }

  static JoinPath(str: string, ...str2: string[]): Promise<string> {
    return this.client.Process<string>(`utils.str.JoinPath`, str, ...str2);
  }

  static UUID(): Promise<string> {
    return this.client.Process<string>(`utils.str.UUID`);
  }
}
/**
 * 日志对象
 */
export class Utils extends Base {
  //   static with(c: YaoApplication) {
  //     Base.client = c;
  //     return this; // Return the class itself
  //   }
  //   static client: YaoApplication;

  static Now(): typeof Now {
    return Now.with(this.client);
  }
  static Arr(): typeof Arr {
    return Arr.with(this.client);
  }
  static Map(): typeof YaoMap {
    return YaoMap.with(this.client);
  }

  static Captcha(): typeof Captcha {
    return Captcha.with(this.client);
  }

  static Str(): typeof Str {
    return Str.with(this.client);
  }
  static Session(): typeof Session {
    return Session.with(this.client);
  }

  static FlattenTree(
    tree: Array<YaoRecord>,
    option: FlattenOption = {
      primary: "id",
      children: "children",
      parent: "parent",
    }
  ): Promise<Array<YaoRecord>> {
    return this.client.Process("utils.tree.Flatten", tree, option);
  }

  static PasswordValidate(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client
        .Process<boolean>("utils.pwd.Verify", password, passwordHash)
        .then((result) => resolve(result))
        .catch((error) => resolve(false)); // resolve with `false` in case of an error
    });
  }

  /**
   * Make jwt Token
   * @param uid unique id
   * @param data user data
   * @param option jwt option
   * @returns
   */
  static JwtMake(
    uid: number,
    data: YaoRecord,
    option: JwtOption
  ): Promise<JwtToken> {
    return this.client.Process("utils.jwt.Make", uid, data, option);
  }
  /**
   * Vlidate the token string
   * @param tokenString jwt token
   * @param secret
   * @returns
   */
  static JwtValidate(
    tokenString: string,
    secret: ArrayBuffer
  ): Promise<JwtClaims> {
    return this.client.Process("utils.jwt.Verify", tokenString, secret);
  }

  static SSLSign(
    data: string,
    certName: string,
    algorithm: string
  ): Promise<string> {
    return this.client.Process("ssl.sign", data, certName, algorithm);
  }

  static SSLVerify(
    data: string,
    sign: string,
    certName: string,
    algorithm: string
  ): Promise<boolean> {
    return this.client.Process("ssl.verify", data, sign, certName, algorithm);
  }
}
