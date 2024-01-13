import { YaoClient } from "./client";
/**
 * 使用 FS 对象实现文件操作。 Yao 提供 System, DSL, Script 三个空间,
 * System 用于应用数据操作,
 * DSL 用于DSL文件操作,
 * Script 用于脚本文件操作;
 * DSL 和 Script 只能用于 stuido 脚本。
 *
 * let fs = new FS("system");
 *
 * let data = fs.ReadFile("/f1.txt"); // /data/app/data/f1.txt
 */

export class FS extends YaoClient {
  // [key: string]: any;
  space: "system" | "dsl" | "script";
  basePath: string;
  /**
   * system	/data/app/data	应用数据
   * dsl	/data/app	除 scripts 外的所有目录(仅 Studio 脚本可用)
   * script	/data/app/scirpts	脚本目录(仅 Studio 脚本可用)
   * @param space
   */
  constructor(space: "system" | "dsl" | "script" = "system") {
    super();
    if (!space) {
      throw Error(`文件操作需要指定一个参数:"system" | "dsl" | "script"`);
    }
    this.basePath = "./";
    this.space = space;
    let yao_app_root = process.env.YAO_APP_ROOT;
    if (!yao_app_root) {
      yao_app_root = "./";
    }
  }

  async request(method: string, ...args: any[]) {
    const response = await this.client.request(
      {},
      {
        type: "FileSystem",
        method: method,
        space: this.space,
        args: args,
      }
    );
    const res = await response.json();
    if (response.status != 200) {
      if (res.code && res.message) {
        throw Error(`Exception|${res.code}${res.message}`);
      }
      throw Error(`请求出错:${response.statusText}`);
    }
    return res.data;
  }
  async ReadFile(src: string) {
    return this.request("ReadFile", src);
  }
  /**
   * 不建议使用这个种通用的方式读取文件内容
   * @param src
   * @returns
   */
  ReadFileBuffer(src: string) {
    throw new Error("read file buffer not supported");
    // return this.request("ReadFileBuffer", src);
  }
  WriteFile(src: string, str: any, mode?: number) {
    return this.request("WriteFile", src, str, mode);
  }
  WriteFileBuffer(
    src: string,
    buffer: string | NodeJS.ArrayBufferView,
    mode?: number
  ) {
    throw new Error("write file buffer not supported");

    // return this.request("WriteFileBuffer", src, buffer, mode);
  }
  ReadDir(src: string, recursive?: boolean) {
    return this.request("ReadDir", src, src, recursive);
  }
  Mkdir(src: string, mode?: number) {
    return this.request("Mkdir", src, src, src, mode);
  }
  /**
   * 根据目录，创建必须的目录
   * @param src 目录
   * @param mode 目录权限
   * @returns
   */
  MkdirAll(src: string, mode?: number) {
    return this.request("MkdirAll", src, mode);
  }
  /**
   * 创建一个临时目录，该目录具有唯一的、随机生成的名称，并且只能由当前用户访问
   * @param src 目录
   * @param pattern 指定临时目录的前缀
   * @returns 创建的临时目录的路径
   */
  MkdirTemp(src: string, pattern?: string) {
    return this.request("MkdirTemp", src, pattern);
  }
  Exists(src: string) {
    return this.request("Exists", src);
  }
  IsDir(src: string) {
    return this.request("IsDir", src);
  }
  IsFile(src: string) {
    return this.request("IsFile", src);
  }
  Remove(src: string) {
    return this.request("Remove", src);
  }
  RemoveAll(src: string) {
    return this.request("RemoveAll", src);
  }
  Chmod(src: string, mode: number) {
    return this.request("Chmod", src, mode);
  }
  BaseName(src: string) {
    return this.request("BaseName", src);
  }
  DirName(src: string) {
    return this.request("DirName", src);
  }
  ExtName(src: string) {
    return this.request("ExtName", src);
  }
  MimeType(src: string) {
    return this.request("MimeType", src);
  }
  Mode(src: string) {
    return this.request("Mode", src);
  }
  Size(src: string) {
    return this.request("Size", src);
  }
  ModTime(src: string) {
    return this.request("ModTime", src);
  }
  Copy(src: string, target: string) {
    return this.request("Copy", src, target);
  }
  Move(src: string, target: string) {
    return this.request("Move", src, target);
  }
}
