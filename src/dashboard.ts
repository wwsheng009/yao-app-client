import type { YaoQueryParam } from "yao-app-ts-types";
import { YaoClient } from "./client";
import type { YaoRecord } from "../types/yao";

export default class Dashboard<T> extends YaoClient {
    name: string;
    constructor(name: string) {
        super()
        this.name = name;
    }
    async Setting(): Promise<YaoRecord> {
        return this.client.Process<YaoRecord>(`yao.dashboard.Setting`, this.name)
    }
    async Xgen(): Promise<YaoRecord> {
        return this.client.Process<YaoRecord>(`yao.dashboard.Xgen`, this.name)
    }
    /**
     * 
     * 获取table中配置的远程组件信息
     * @param xpath 组件的路径，fields.filter.状态.edit.props.xProps
     * @param method 组件的列表属性，比如下拉框的远程数据 remote
     * @param query 查询条件
     * @returns 
     */
    async Component(xpath: string, method: string, query?: YaoQueryParam.QueryParam): Promise<Array<YaoRecord>> {
        return this.client.Process<Array<YaoRecord>>(`yao.dashboard.Component`, this.name, xpath, method, query)
    }

    /**
     * 读取dashboard的action中配置的数据
     * @param query 
     * @returns 
     */
    async Data(query?: YaoQueryParam.QueryParam): Promise<T> {
        return this.client.Process<T>(`yao.dashboard.Data`, this.name, query)
    }

}