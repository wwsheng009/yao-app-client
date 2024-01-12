export type YaoResponse = {
  code?: number;
  message?: string;
  data?: any;
};

export type ID = number | string;
export type YaoRecord = { [key: string]: any };
export type Error = null | {
  code: number,
  message: string
}
export type SelectOption = {
  name: string,
  id: string | number
}

export interface Paginate<T> {
  data: Array<T>,
  pagesize: number,
  pagecnt: number,
  page: number,
  next: number,
  prev: number,
  total: number,
}

export interface ReqeustPayload {
  type: string;
  method: string;
  engine?: string;
  args?: object;
  space?: string;
  key?: string;
  value?: object;
  message?: string;
}

export interface UploadFile {
  name: string
  tempFile: string
  size: number,
  mimeType: YaoRecord
}