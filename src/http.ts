import { YaoApplication } from "./yao";
export type HttpHeaders = object | object[];

/**
 * 使用 http 对象发送 HTTP 请求，参数表与返回值与 http.* 处理器一致
 * 虽然可以直接使用fetch，但是在参数与文件处理上比较麻烦
 */
export class Http {
  //   client: null as unknown as YaoClient,
  static with(c: YaoApplication): typeof Http {
    Http.client = c;
    return Http
  }
  static client: YaoApplication
  /**
   * YAO Http Post 代理
   * http.Post	[<URL>, <Payload (可选)>, <Files (可选)>, <Query(可选)>, <Headers (可选)>]	响应结果	发送 HTTP POST 请求 示例 文档
   * @param {string} URL  目标网址
   * @param {object} Payload  请求数据, 示例: {"name":"Pet"}, http.Post 发送时候自动添加 Content-type: application/json; charset=utf-8 Header
   * @param {object} Files 上传文件, 示例: {"file":"/path/root/file"}, 文件路径为相对路径 相对地址, 示例: /text/foo.txt, 绝对路径为: /data/app/data/text/foo.txt。 如 Files 不为 null，自动添加 Content-type: multipart/form-data Header
   * @param {object} Query  Query 参数, 示例: {"foo":"bar", "arr[]":"hello,world"}, 对应 Query string: foo=bar&arr[]=hello&arr[]=world
   * @param {HttpHeaders} Headers  请求 Header, 示例: {"Secret":"********"} 或 [{"Secret":"********"}, {"Secret":"#####"}]
   * @returns
   */
  static Post(
    URL: string,
    Payload?: object,
    Files?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    const payload = {
      type: "Http",
      method: "Post",
      args: [URL, Payload, Files, Query, Headers],
    }
    return Http.client.request({}, payload);
  }
  /**
   * YAO Http Get 代理
   * http.Get	[<URL>, <Query (可选)>, <Headers (可选)>]	响应结果	发送 HTTP GET 请求 示例 文档
   * @param {string} URL 请求数据
   * @param {object} Query Query 参数
   * @param {object} Headers 请求 Header
   * @returns
   */
  static Get(URL: string, Query?: object, Headers?: HttpHeaders) {
    const payload = {
      type: "Http",
      method: "Get",
      args: [URL, Query, Headers],
    };
    return this.client.request({}, payload);
  }
  /**
   * YAO Http Head 代理
   *
   * http.Head	[<URL>, <Payload (可选)>, <Query (可选)>, <Headers (可选)>]	响应结果	发送 HTTP HEAD 请求 示例 文档
   * @param {string} URL 目标网址
   * @param {object} Payload 请求数据
   * @param {object} Files 上传文件
   * @param {object} Query Query 参数
   * @param {object} Headers 请求 Header
   * @returns
   */
  static Head(
    URL: string,
    Payload?: object,
    Files?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    const payload = {
      type: "Http",
      method: "Head",
      args: [URL, Payload, Files, Query, Headers],
    };
    return this.client.request({}, payload);
  }
  /**
   * YAO Http Put 代理
   *
   * http.Put	[<URL>, <Payload (可选)>, <Query(可选)>, <Headers (可选)>]	响应结果	发送 HTTP PUT 请求 示例 文档
   * @param {string} URL 目标网址
   * @param {object} Payload 请求数据
   * @param {object} Files 上传文件
   * @param {object} Query Query 参数
   * @param {HttpHeaders} Headers 请求 Header
   * @returns
   */
  static Put(
    URL: string,
    Payload?: object,
    Files?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    const payload = {
      type: "Http",
      method: "Put",
      args: [URL, Payload, Files, Query, Headers],
    };
    return this.client.request({}, payload);
  }
  /**
   * YAO Http Patch Put 代理
   *
   * http.Patch	[<URL>, <Payload (可选)>, <Query(可选)>, <Headers (可选)>]	响应结果	发送 HTTP PATCH 请求 示例 文档
   * @param {string} URL 目标网址
   * @param {object} Payload 请求数据
   * @param {object} Files 上传文件
   * @param {object} Query Query 参数
   * @param {HttpHeaders} Headers 请求 Header
   * @returns
   */
  static Patch(
    URL: string,
    Payload?: object,
    Files?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    const payload = {
      type: "Http",
      method: "Patch",
      args: [URL, Payload, Files, Query, Headers],
    };
    return this.client.request({}, payload);
  }
  /**
   * YAO Http Delete 代理
   *
   * http.Delete	[<URL>, <Payload (可选)>, <Query(可选)>, <Headers (可选)>]	响应结果	发送 HTTP DELETE 请求 示例 文档
   * @param {string} URL 目标网址
   * @param {object} Payload 请求数据
   * @param {object} Files 上传文件
   * @param {object} Query Query 参数
   * @param {HttpHeaders} Headers 请求 Header
   * @returns
   */
  static Delete(
    URL: string,
    Payload?: object,
    Files?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    const payload = {
      type: "Http",
      method: "Delete",
      args: [URL, Payload, Files, Query, Headers],
    };
    return this.client.request({}, payload);
  }
  /**
   * YAO Http Send 代理
   *
   * http.Send	[<METHOD>, <URL>, <Query (可选)>, <Payload (可选)>, <Headers (可选)>]	响应结果	发送 HTTP POST 请求, 返回 JSON 数据 示例 文档
   * @param {string} URL 目标网址
   * @param {object} Payload 请求数据
   * @param {object} Files 上传文件
   * @param {object} Query Query 参数
   * @param {HttpHeaders} Headers 请求 Header
   * @returns
   */
  static Send(
    METHOD: string,
    URL: string,
    Payload?: object,
    Files?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    const payload = {
      type: "Http",
      method: "Send",
      args: [METHOD, URL, Payload, Files, Query, Headers],
    };
    return this.client.request({}, payload);
  }

  /**
   * http.Stream
   * args[0] Method GET/POST/PUT/PATCH/DELETE/...
   * args[1] URL
   * args[2] Handler procsss name
   * args[3] Payload <Optional> "Foo", {"foo":"bar"}, ["foo", "bar", {"k1":"v1"}], "/root/path"
   * args[4] Query Params <Optional> {"k1":"v1", "k2":"v2"}, ["k1=v1","k1"="v11","k2"="v2"], [{"k1":"v1"},{"k1":"v11"},{"k2":"v2"}], k1=v1&k1=v11&k2=k2
   * args[5] Headers <Optional> {"K1":"V1","K2":"V2"}  [{"K1":"V1"},{"K1":"V11"},{"K2":"V2"}]
   * @param METHOD HTTP 调用方法
   * @param URL http url地址
   * @param Callback 回调函数
   * @param Payload 请求内容
   * @param Query 查询参数对象
   * @param Headers 请求头
   * @returns normal return 1  exception return -1 break return 0
   */
  static Stream(
    METHOD: string,
    URL: string,
    Callback?: Function,
    Payload?: object,
    Query?: object,
    Headers?: HttpHeaders
  ) {
    let url = URL;

    if (Query) {
      //todo 需要优化
      if (typeof Query === "object") {
        const params = new URLSearchParams();
        let query = Query as { [key: string]: string };
        for (const key in query) {
          params.append(key, query[key]);
        }

        const queryString = params.toString(); // "name=John&age=30&city=New%20York"
        if (url.includes("?")) {
          url = url + "&" + queryString;
        } else {
          url = url + "?" + queryString;
        }
      }
    }

    fetch(url, {
      headers: Headers as Record<string, string>,
      method: METHOD,
      body: JSON.stringify({ ...Payload, stream: true }),
    })
      .then((response) => {
        const reader = response.body?.getReader();
        function readStream() {
          if (reader) {
            reader
              .read()
              .then(({ value, done }) => {
                if (!done) {
                  const data = new TextDecoder().decode(value);
                  Callback?.(data);
                  return readStream();
                } else {
                  // eslint-disable-next-line no-console
                  console.trace("http stream api called done");
                  return 1;
                }
              })
              .catch((error) => {
                console.log(error);
                return -1;
              });
          }
          return 1;
        }
        return readStream();
      })
      .catch((error) => {
        console.log(error);
        return -1;
      });

    return 1;
  }
}
