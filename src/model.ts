import type { YaoQueryParam } from "yao-app-ts-types";
import type { ID, Paginate, SelectOption, YaoRecord } from "./types/yao";
import { YaoClient } from "./client";

export default class Model<T> extends YaoClient {
    name: string;
    constructor(name: string) {
        super()
        this.name = name;
    }
    /**
     * Find 查询单条记录
     * @param id 
     * @param query 
     * @returns 
     */
    async Find(id: ID, query: YaoQueryParam.QueryParam): Promise<T> {
        return this.client.Process<T>(`models.${this.name}.Find`, id, query)
    }
    /**
     * Paginate 按条件查询, 分页, 失败抛出异常
     * @param query 
     * @param page 
     * @param pagesize 
     * @returns 
     */
    async Paginate(query: YaoQueryParam.QueryParam, page: number, pagesize: number): Promise<Paginate<T>> {
        return this.client.Process<Paginate<T>>(`models.${this.name}.Paginate`, query, page, pagesize)
    }
    /**
     * Get 按条件查询, 不分页, 失败抛出异常
     * @param query 
     * @returns 
     */
    async Get(query: YaoQueryParam.QueryParam): Promise<Array<T>> {
        return this.client.Process<Array<T>>(`models.${this.name}.Get`, query)
    }
    /**
     * Create 创建单条数据, 返回新创建数据ID, 失败抛出异常
     * @param record 
     * @returns 
     */
    async Create(record: T): Promise<number> {
        return this.client.Process<number>(`models.${this.name}.Create`, record)
    }

    /**
     * Update 更新单条数据, 失败抛出异常
     * @param id 
     * @param record 
     * @returns 
     */
    async Update(id: ID, record: T): Promise<null> {
        return this.client.Process<null>(`models.${this.name}.Update`, id, record)
    }
    /**
     * Save 保存单条数据, 返回数据ID, 失败抛出异常
     * @param record 
     * @returns 
     */
    async Save(record: T): Promise<ID> {
        return this.client.Process<ID>(`models.${this.name}.Save`, record)
    }
    /**
     * Delete 删除单条记录, 失败抛出异常
     * @param id 
     * @returns 
     */
    async Delete(id: ID): Promise<null> {
        return this.client.Process<null>(`models.${this.name}.Delete`, id)
    }
    /**
     * Destroy 真删除单条记录, 失败抛出异常
     * @param id 
     * @returns 
     */
    async Destroy(id: ID): Promise<null> {
        return this.client.Process<null>(`models.${this.name}.Destroy`, id)
    }
    /**
     * Insert 插入多条数据, 失败抛出异常
     * @param columns 
     * @param records 
     * @returns 
     */
    async Insert(columns: Array<string>, records: Array<Array<any>>): Promise<null> {
        return this.client.Process<null>(`models.${this.name}.Insert`, columns, records)
    }
    /**
     * UpdateWhere 按条件更新记录, 返回更新行数, 失败抛出异常
     * @param query 
     * @param record 
     * @returns 
     */
    async UpdateWhere(query: YaoQueryParam.QueryParam, record: YaoRecord): Promise<number> {
        return this.client.Process<number>(`models.${this.name}.UpdateWhere`, query, record)
    }

    /**
     * DeleteWhere 批量删除数据, 返回更新行数, 失败抛出异常
     * @param query 
     * @returns 
     */
    async DeleteWhere(query: YaoQueryParam.QueryParam): Promise<number> {
        return this.client.Process<number>(`models.${this.name}.DeleteWhere`, query)
    }
    /**
     * DestroyWhere 批量真删除数据, 返回更新行数, 失败抛出异常
     * @param query 
     * @returns 
     */
    async DestroyWhere(query: YaoQueryParam.QueryParam): Promise<number> {
        return this.client.Process<number>(`models.${this.name}.DestroyWhere`, query)
    }

    /**
     * EachSave 批量保存数据, 返回数据ID集合, 失败抛出异常
     * @param rows 
     * @param eachRow 每行都相同的内容
     * @returns 
     */
    async EachSave(rows: Array<YaoRecord>, eachRow?: YaoRecord): Promise<Array<number>> {
        return this.client.Process<Array<number>>(`models.${this.name}.EachSave`, rows, eachRow)
    }
    /**
     * EachSaveAfterDelete 批量删除数据后，再批量保存数据, 返回数据ID集合, 失败抛出异常
     * @param ids 需要删除的数据
     * @param rows 
     * @param eachRow 
     * @returns 
     */
    async EachSaveAfterDelete(ids: Array<ID>, rows: Array<YaoRecord>, eachRow?: YaoRecord): Promise<Array<ID>> {
        return this.client.Process<Array<ID>>(`models.${this.name}.EachSaveAfterDelete`, ids, rows, eachRow)
    }

    /**
     * 
     * @param keyword 
     * @param name 
     * @param value 
     * @param limit 
     * @returns 
     */
    async SelectOption(keyword?: string, name: string = 'name', value: string = 'id', limit: number = 20): Promise<Array<SelectOption>> {
        return this.client.Process<Array<SelectOption>>(`models.${this.name}.SelectOption`, keyword, name, value, limit)
    }

    async Migrate(force: boolean = false): Promise<Error> {
        return this.client.Process<Error>(`models.${this.name}.Migrate`, force)
    }

    async Load(file: string, source?: string): Promise<Error> {
        return this.client.Process<Error>(`models.${this.name}.Load`, file, source)
    }

}