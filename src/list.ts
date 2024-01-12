import type { YaoQueryParam } from "yao-app-ts-types";
import { YaoClient } from "./client";
import type { ID, UploadFile, YaoRecord } from "./types/yao";

export default class List<T> extends YaoClient {
    name: string;
    constructor(name: string) {
        super()
        this.name = name;
    }
    async Setting(): Promise<YaoRecord> {
        return this.client.Process<YaoRecord>(`yao.form.Setting`, this.name)
    }
    async Xgen(): Promise<YaoRecord> {
        return this.client.Process<YaoRecord>(`yao.form.Xgen`, this.name)
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
        return this.client.Process<Array<YaoRecord>>(`yao.form.Component`, this.name, xpath, method, query)
    }
    /**
     * 下载表字段关联的文件
     * @param field 字段
     * @param file 文件名
     * @param tokenString 
     * @returns 
     */
    async Download(field: string, file: string, tokenString: string): Promise<any> {
        return this.client.Process<any>(`yao.form.Download`, this.name, field, file, tokenString)
    }
    /**
     * 上传文件
     * @param xpath 组件的路径，fields.table.相关图片.edit.props
     * @param method 组件的列表属性，api
     * @param fileKey $file.file
     * @returns 
     */
    async Upload(xpath: string, method: string, tmpfile: UploadFile): Promise<string> {
        return this.client.Process<string>(`yao.form.Download`, this.name, xpath, method, tmpfile)
    }

    /**
     * Save 保存单条数据, 返回数据ID, 失败抛出异常
     * @param record 
     * @returns 
     */
    async Save(record: T): Promise<ID> {
        return this.client.Process<ID>(`yao.form.Save`, this.name, record)
    }

}