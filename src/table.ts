import type { YaoQueryParam } from "yao-app-ts-types";
import { YaoClient } from "./client";
import type { ID, Paginate, UploadFile, YaoRecord } from "../types/yao";

export default class Table<T> extends YaoClient {
    name: string;
    constructor(name: string) {
        super()
        this.name = name;
    }
    async Setting(): Promise<YaoRecord> {
        return this.client.Process<YaoRecord>(`yao.table.Setting`, this.name)
    }
    async Xgen(): Promise<YaoRecord> {
        return this.client.Process<YaoRecord>(`yao.table.Xgen`, this.name)
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
        return this.client.Process<Array<YaoRecord>>(`yao.table.Component`, this.name, xpath, method, query)
    }
    /**
     * 下载表字段关联的文件
     * @param field 字段
     * @param file 文件名
     * @param tokenString 
     * @returns 
     */
    async Download(field: string, file: string, tokenString: string): Promise<any> {
        return this.client.Process<any>(`yao.table.Download`, this.name, field, file, tokenString)
    }
    /**
     * 上传文件
     * @param xpath 组件的路径，fields.table.相关图片.edit.props
     * @param method 组件的列表属性，api
     * @param fileKey $file.file
     * @returns 
     */
    async Upload(xpath: string, method: string, tmpfile: UploadFile): Promise<string> {
        return this.client.Process<string>(`yao.table.Download`, this.name, xpath, method, tmpfile)
    }
    /**
     * Find 查询单条记录
     * @param id 
     * @param query 
     * @returns 
     */
    async Find(id: number, query: YaoQueryParam.QueryParam): Promise<T> {
        return this.client.Process<T>(`yao.table.Find`, this.name, id, query)
    }
    /**
     * Search 按条件查询, 分页, 失败抛出异常
     * @param query 
     * @param page 
     * @param pagesize 
     * @returns 
     */
    async Search(query: YaoQueryParam.QueryParam, page: number, pagesize: number): Promise<Paginate<T>> {
        return this.client.Process<Paginate<T>>(`yao.table.Search`, this.name, query, page, pagesize)
    }
    /**
     * Get 按条件查询, 不分页, 失败抛出异常
     * @param query 
     * @returns 
     */
    async Get(query: YaoQueryParam.QueryParam): Promise<Array<T>> {
        return this.client.Process<Array<T>>(`yao.table.Get`, this.name, query)
    }
    /**
     * Create 创建单条数据, 返回新创建数据ID, 失败抛出异常
     * @param record 
     * @returns 
     */
    async Create(record: T): Promise<number> {
        return this.client.Process<number>(`yao.table.Create`, this.name, record)
    }

    /**
     * Update 更新单条数据, 失败抛出异常
     * @param id 
     * @param record 
     * @returns 
     */
    async Update(id: ID, record: T): Promise<null> {
        return this.client.Process<null>(`yao.table.Update`, this.name, id, record)
    }
    /**
     * Save 保存单条数据, 返回数据ID, 失败抛出异常
     * @param record 
     * @returns 
     */
    async Save(record: T): Promise<ID> {
        return this.client.Process<ID>(`yao.table.Save`, this.name, record)
    }
    /**
     * Delete 删除单条记录, 失败抛出异常
     * @param id 
     * @returns 
     */
    async Delete(id: ID): Promise<null> {
        return this.client.Process<null>(`yao.table.Delete`, this.name, id)
    }

    /**
     * Insert 插入多条数据, 失败抛出异常
     * @param columns 
     * @param records 
     * @returns 
     */
    async Insert(columns: Array<string>, records: Array<Array<any>>): Promise<null> {
        return this.client.Process<null>(`yao.table.Insert`, this.name, columns, records)
    }

    /**
     * 按ID更新数据
     * @param ids ids seperate by ','
     * @param record 
     * @returns 
     */
    async UpdateIn(ids: string, record: YaoRecord): Promise<number> {
        return this.client.Process<number>(`yao.table.UpdateIn`, this.name, ids, record)
    }

    /**
     * UpdateWhere 按条件更新记录, 返回更新行数, 失败抛出异常
     * @param query 
     * @param record 
     * @returns 
     */
    async UpdateWhere(query: YaoQueryParam.QueryParam, record: YaoRecord): Promise<number> {
        return this.client.Process<number>(`yao.table.UpdateWhere`, this.name, query, record)
    }

    /**
     * DeleteWhere 批量删除数据, 返回更新行数, 失败抛出异常
     * @param query 
     * @returns 
     */
    async DeleteWhere(query: YaoQueryParam.QueryParam): Promise<number> {
        return this.client.Process<number>(`yao.table.DeleteWhere`, this.name, query)
    }
    /**
     * 批量删除表记录
     * @param ids id array join by ','
     * @returns 
     */
    async DeleteIn(ids: Array<string>): Promise<number> {
        return this.client.Process<number>(`yao.table.DeleteIn`, this.name, ids)
    }

    /**
     * Export Export query result to Excel
     * @param params 查询条件
     * @param pagesize 单次查询的页面大小
     * @returns 
     */
    async Export(params: YaoQueryParam.QueryParam, pagesize: number): Promise<string> {
        return this.client.Process<string>(`yao.table.Export`, this.name, params, pagesize)
    }

    async Load(file: string): Promise<Error> {
        return this.client.Process<Error>(`yao.table.Load`, this.name, file)
    }

}