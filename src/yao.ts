import type { ReqeustPayload, YaoResponse } from "./types/yao";
import Dashboard from "./dashboard";
import Form from "./form";
import { Http } from "./http";
import List from "./list";
import { Log } from "./log";
import Model from "./model";
import { getProcess } from "./process";
import Table from "./table";
import { Utils } from "./utils";
import Schema from "./schema";
import { FS } from "./filesystem";

/**
 * Yao Application Client
 */
export class YaoApplication {
  endpoint: string;
  token: string;

  constructor(endpoint: string, token: string) {
    this.endpoint = endpoint;
    this.token = token;
  }
  /**
   * create a new model instance by name
   * @param name model name
   * @returns new model instance
   */
  Model<T>(name: string): Model<T> {
    const m = new Model<T>(name).with(this);
    return m;
  }

  FS(name: "system" | "dsl" | "script" = "system"): FS {
    const m = new FS(name).with(this);
    return m;
  }

  Table<T>(name: string): Table<T> {
    const m = new Table<T>(name).with(this);
    return m;
  }

  Schema<T>(name: string): Schema<T> {
    const m = new Schema<T>(name).with(this);
    return m;
  }

  Form<T>(name: string): Form<T> {
    const m = new Form<T>(name).with(this);
    return m;
  }

  List<T>(name: string): List<T> {
    const m = new List<T>(name).with(this);
    return m;
  }
  Dashboard<T>(name: string): Dashboard<T> {
    const m = new Dashboard<T>(name).with(this);
    return m;
  }

  http(): typeof Http {
    return Http.with(this);
  }

  Log(): typeof Log {
    return Log.with(this);
  }
  Translate(args: string) {
    this.request(
      {},
      {
        type: "Translate",
        method: "",
        message: args,
      }
    );
  }

  Utils(): typeof Utils {
    return Utils.with(this);
  }

  Studio(method: string, ...args: any[]) {
    return this.request({}, { type: "Studio", method: method, args });
  }

  async Process<T>(processor: string, ...args: any[]): Promise<T> {
    const pname = processor.toLocaleLowerCase();
    const fn = getProcess(pname);
    if (fn != undefined) {
      return fn(pname, ...args);
    }

    const es = await this.request(
      {},
      {
        type: "Process",
        method: processor.toLocaleLowerCase(),
        args,
      }
    );

    if (es.status != 200) {
      throw Error(`请求出错:${es.statusText}`);
    }
    let ret = (await es.json()) as YaoResponse;
    if (!ret.data && ret.code && ret.message) {
      throw Error(`远程程序执行异常:代码:${ret.code},消息：${ret.message}`);
    }
    return ret.data as T;
  }

  request(config: RequestInit, payload: ReqeustPayload): Promise<Response> {
    let c = config || {};
    c.headers = c.headers || {};
    if (c.headers) {
      Object.assign(c.headers, {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      });
    }

    c.method = "POST";
    c.body = JSON.stringify(payload);
    return fetch(this.endpoint, c);
  }
}
