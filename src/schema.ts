import type { YaoQueryParam } from "yao-app-ts-types";
import type { ID, Paginate, SelectOption, YaoRecord } from "./types/yao";
import { YaoClient } from "./client";

// /**`[<数据库名称>]`|-|创建一个数据库(或 Schema)|*/
// Create = "schemas.<ID>.Create",
// /**`[<数据库名称>]`|-|删除一个数据库(或 Schema)|*/
// Drop = "schemas.<ID>.Drop",
// /**`[<数据表前缀(可选)>]`|数据表名称数组|读取数据表, 返回数据表名称数组|*/
// Tables = "schemas.<ID>.Tables",
// /**`[<数据表名称>]`|数据表结构信息|读取数据表结构, 返回数据表结构信息|*/
// TableGet = "schemas.<ID>.TableGet",
// /**`[<数据表名称>, <数据表结构>]`|-|创建一张数据表|*/
// TableCreate = "schemas.<ID>.TableCreate",
// /**`[<数据表名称>, <数据表结构>]`|-|保存一张数据表, 不存在创建, 存在更新|*/
// TableSave = "schemas.<ID>.TableSave",
// /**`[<数据表名称>]`|-|删除一张数据表|*/
// TableDrop = "schemas.<ID>.TableDrop",
// /**`[<数据表名称>, <新数据表名称>]`|-|数据表改名|*/
// TableRename = "schemas.<ID>.TableRename",
// /**`[<数据表结构>, <另一个数据表结构>]`|两个表结构差异|比较两个表结构, 返回两张表差异信息|*/
// TableDiff = "schemas.<ID>.TableDiff",
// /**`[<数据表名称>, <字段结构>]`|-|给数据表添加一个字段|*/
// ColumnAdd = "schemas.<ID>.ColumnAdd",
// /**`[<数据表名称>, <字段结构>]`|-|更新字段结构,如字段不存在则添加一个字段|*/
// ColumnAlt = "schemas.<ID>.ColumnAlt",
// /**`[<数据表名称>, <字段名称>]`|-|删除一个字段|*/
// ColumnDel = "schemas.<ID>.ColumnDel",
// /**`[<数据表名称>, <索引结构>]`|-|添加一个索引|*/
// IndexAdd = "schemas.<ID>.IndexAdd",
// /**`[<数据表名称>, <索引名称>]`|-|删除一个索引|*/
// IndexDel = "schemas.<ID>.IndexDel",

// Interface for Blueprint
export interface Blueprint {
  columns?: SchemaColumn[];
  indexes?: SchemaIndex[];
  option?: BlueprintOption;
}

export interface BlueprintDiff {
  Columns: {
    Add: SchemaColumn[];
    Del: SchemaColumn[];
    Alt: SchemaColumn[];
  };
  Indexes: {
    Add: SchemaIndex[];
    Del: SchemaIndex[];
    Alt: SchemaIndex[];
  };
  Option: { [key: string]: boolean };
}

// Interface for BlueprintOption
interface BlueprintOption {
  timestamps?: boolean; // + created_at, updated_at fields
  soft_deletes?: boolean; // + deleted_at field
  trackings?: boolean; // + created_by, updated_by, deleted_by fields
  constraints?: boolean; // + 约束定义
  permission?: boolean; // + __permission fields
  logging?: boolean; // + __logging_id fields
  read_only?: boolean; // + Ignore the migrate operation
}

// Interface for Column
interface SchemaColumn {
  name: string;
  label?: string;
  type?: string;
  title?: string;
  description?: string;
  comment?: string;
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  option?: string[];
  default?: any; // `interface{}` in Go translates to `any` in TypeScript
  default_raw?: string;
  generate?: string; // Increment, UUID,...
  crypt?: string; // AES, PASSWORD, AES-256, AES-128, PASSWORD-HASH, ...
  index?: boolean;
  unique?: boolean;
  primary?: boolean;
  origin?: string;
}

// Interface for Index
export interface SchemaIndex {
  comment?: string;
  name?: string;
  columns?: string[];
  type?: string; // primary, unique, index, match
  origin?: string;
}

export default class Schema<T> extends YaoClient {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }

  /**
   * Create a Schema
   * @param name
   * @returns
   */
  async Create(name: string): Promise<void> {
    return this.client.Process<void>(`schemas.${this.name}.Create`, name);
  }

  /**
   * Delete a Schema
   * @param name
   * @returns
   */
  async Drop(name: string): Promise<void> {
    return this.client.Process<void>(`schemas.${this.name}.Drop`, name);
  }

  /**
   * Read tables, return array of table names
   * @param preifx
   * @returns
   */
  async Tables(preifx?: string): Promise<string[]> {
    return this.client.Process<string[]>(`schemas.${this.name}.Tables`, preifx);
  }

  /**
   * Read table structure, return table structure information
   * @param tableName
   * @returns
   */
  async TableGet(tableName: string): Promise<Blueprint> {
    return this.client.Process<Blueprint>(
      `schemas.${this.name}.TableGet`,
      tableName
    );
  }

  /**
   * Create a table
   * @param tableName
   * @param structure
   * @returns
   */
  async TableCreate(tableName: string, structure: Blueprint): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.TableCreate`,
      tableName,
      structure
    );
  }

  /**
   * Save a table (create if not exists, update if exists)
   * @param tableName
   * @param structure
   * @returns
   */
  async TableSave(tableName: string, structure: Blueprint): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.TableSave`,
      tableName,
      structure
    );
  }

  /**
   * Delete a table
   * @param tableName
   * @returns
   */
  async TableDrop(tableName: string): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.TableDrop`,
      tableName
    );
  }

  /**
   *  Rename a table
   * @param tableName
   * @param newTableName
   * @returns
   */
  async TableRename(tableName: string, newTableName: string): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.TableRename`,
      tableName,
      newTableName
    );
  }

  /**
   * Compare two table structures, return differences
   * @param blueprint
   * @param anotherBlueprint
   * @returns
   */
  async TableDiff(
    blueprint: Blueprint,
    anotherBlueprint: Blueprint
  ): Promise<BlueprintDiff> {
    return this.client.Process<BlueprintDiff>(
      `schemas.${this.name}.TableDiff`,
      blueprint,
      anotherBlueprint
    );
  }

  /**
   * Add a column to a table
   * @param tableName
   * @param columnStructure
   * @returns
   */
  async ColumnAdd(
    tableName: string,
    columnStructure: SchemaColumn
  ): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.ColumnAdd`,
      tableName,
      columnStructure
    );
  }

  /**
   * Alter a column (add if not exists)
   * @param tableName
   * @param columnStructure
   * @returns
   */
  async ColumnAlt(
    tableName: string,
    columnStructure: SchemaColumn
  ): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.ColumnAlt`,
      tableName,
      columnStructure
    );
  }

  /**
   * Delete a column
   * @param tableName
   * @param columnName
   * @returns
   */
  async ColumnDel(tableName: string, columnName: string): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.ColumnDel`,
      tableName,
      columnName
    );
  }

  /**
   * Add an index to a table
   * @param tableName
   * @param indexStructure
   * @returns
   */
  async IndexAdd(
    tableName: string,
    indexStructure: SchemaIndex
  ): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.IndexAdd`,
      tableName,
      indexStructure
    );
  }

  /**
   * Delete an index
   * @param tableName
   * @param indexName
   * @returns
   */
  async IndexDel(tableName: string, indexName: string): Promise<void> {
    return this.client.Process<void>(
      `schemas.${this.name}.IndexDel`,
      tableName,
      indexName
    );
  }
}
