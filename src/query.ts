import type { YaoQuery } from "yao-app-ts-types";
import { YaoClient } from "./client";
type Param = YaoQuery.QueryDSL; //{ [key: string]: any };
/**
 * Yao Query 查询引擎代理
 */
export class Query extends YaoClient {
  engine: string;
  constructor(engine?: string) {
    super()
    //default or xiang
    this.engine = engine || "";
  }
  // [key: string]: any;
  /**
   * 执行查询并返回数据记录集合
   *
   * query.Get({"select":["id"], "from":"user", "limit":1})
   *
   * @param {object} args 查询条件
   * @returns []Record
   */
  Get(args: Param) {
    return this.client.request({}, {
      type: "Query",
      method: "Get",
      engine: this.engine,
      args,
    });
  }

  // Paginate  {
  // "items"`// 数据记录集合
  // "total"`// 总记录数
  // "next"` // 下一页，如没有下一页返回 -1
  // "prev"` // 上一页，如没有上一页返回 -1
  // "page"` // 当前页码
  // "pagesize"` // 每页记录数量
  // "pagecnt"`  // 总页数
  // }
  /**
   * 执行查询并返回带分页信息的数据记录数组
   *
   * query.Paginate({"select":["id"], "from":"user"})
   *
   * @param {any} args 查询条件
   * @returns Paginate
   */
  Paginate(args: Param) {
    return this.client.request({}, {
      type: "Query",
      method: "Paginate",
      engine: this.engine,
      args,
    });
  }
  /**
   * 执行查询并返回一条数据记录
   *
   * query.First({"select":["id"], "from":"user"})
   *
   * @param {any} args 查询条件
   * @returns Record
   */
  First(args: Param) {
    return this.client.request({}, {
      type: "Query",
      method: "First",
      engine: this.engine,
      args,
    });
  }
  /**
   * 执行查询根据查询条件返回结果
   *
   * query.Run({"stmt":"show version"})
   *
   * @param {*} args
   * @returns object
   */
  Run(args: Param) {
    return this.client.request({}, {
      type: "Query",
      method: "Run",
      engine: this.engine,
      args,
    });
  }
}
