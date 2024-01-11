// Query Declaration

import { YaoClient } from "./client";

/**
 * Store 使用缓存
 */
export class Store extends YaoClient {
  space: string;
  /**
   *
   * @param {string} space
   */
  constructor(space: string) {
    super()
    this.space = space;
  }
  /**
   * Get 获取缓存数据
   * @param {string} key
   * @returns
   */
  Get(key: string) {
    return this.client.request({}, {
      type: "Store",
      method: "Get",
      space: this.space,
      key,
    });
  }
  /**
   * Set 设置缓存
   * @param {string} key
   * @param {any} value
   * @returns
   */
  Set(key: string, value: any) {
    return this.client.request({}, {
      type: "Store",
      method: "Get",
      space: this.space,
      key,
      value,
    });
  }
}
