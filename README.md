# yao-app-client

yao application http client wrapper,call the yao application api in browser or the node/nodejs。

## install

To install dependencies:

```bash
# bun
bun install yao-app-client

# or npm
npm install yao-app-client
```

To build:

```bash
bun run build
```

## config

config your yao application

create the below http config file

`/apis/proxy.http.yao`

```json
{
  "name": "代理yao的请求",
  "version": "1.0.0",
  "description": "调试本地yao js脚本",
  "group": "",
  "guard": "-",
  "paths": [
    {
      "guard": "scripts.jsproxy.CheckAccessKey",
      "path": "/call",
      "method": "POST",
      "process": "scripts.jsproxy.ProxyServer",
      "in": [":payload"],
      "out": {
        "status": 200,
        "type": "application/json"
      }
    }
  ]
}
```

create a new js file as below: `/scripts/jsproxy.js`

```js
//代理js api请求
/**
 * api 代理服务，可以放在yao应用下
 * @param {object} payload
 * @returns
 */
function ProxyServer(payload) {
  let resp = {
    code: undefined,
    message: undefined,
    // error: null as Error, //undefined不会出现在返回json key中
    data: undefined,
  };
  try {
    const type = payload.type;
    const method = payload.method;
    const args = payload.args;
    const space = payload.space; //"dsl","script","system"
    const engine = payload.engine;
    let localParams = [];
    if (Array.isArray(args)) {
      localParams = args;
    } else {
      localParams.push(args);
    }
    switch (type) {
      case "Process":
        resp.data = Process(method, ...localParams);
        break;
      case "Studio":
        // @ts-ignore
        __YAO_SU_ROOT = true;
        //0.10.3-dev
        __yao_data = { ROOT: true };
        resp.data = Studio(method, ...localParams);
        break;
      case "Query":
        if (engine) {
          const query = new Query(engine);
          //@ts-ignore
          resp.data = query[method](args);
        } else {
          const query = new Query();
          //@ts-ignore
          resp.data = query[method](args);
        }
        break;
      case "FileSystem":
        const fs = new FS(space);
        //@ts-ignore
        resp.data = fs[method](...args);
        break;
      case "Store":
        const cache = new Store(space);
        if (method == "Set") {
          resp.data = cache.Set(payload.key, payload.value);
        } else if (method == "Get") {
          resp.data = cache.Get(payload.key);
        }
        break;
      case "Http":
        //@ts-ignore
        resp.data = http[method](...args);
        break;
      case "Log":
        //@ts-ignore
        log[method](...args);
        resp.data = {};
        break;
      case "WebSocket":
        //目前yao只是实现了push一个方法，也是ws服务连接后push一条信息
        const ws = new WebSocket(payload.url, payload.protocols);
        if (method == "push") {
          ws.push(payload.message);
          resp.data = {};
        }
        break;
      case "Translate":
        resp.data = $L(payload.message);
        break;
      default:
        resp.code = 500;
        resp.message = `不支持的方法调用${type}`;
    }
  } catch (error) {
    resp.code = error.code || 500;
    resp.message = error.message || "接口调用异常";
  }

  return resp;
}

/**
 * api guard
 * @param {string} path api path
 * @param {map} params api path params
 * @param {map} queries api queries in url query string
 * @param {object|string} payload json object or string
 * @param {map} headers request headers
 */
function CheckAccessKey(path, params, queries, payload, headers) {
  let token = null;
  let auth = headers["Authorization"];
  console.log("headers", headers);
  if (auth) {
    token = auth[0].replace("Bearer ", "");
  }
  token = token || (queries["token"] && queries["token"][0]);
  if (!token) {
    throw new Exception("Debug Proxy Call token Not set", 403);
  }
  const access_key = Process("yao.env.get", "YAO_API_ACCESS_KEY");
  if (!access_key) {
    throw new Exception("YAO_API_ACCESS_KEY Not set", 403);
  }
  if (access_key !== token) {
    throw new Exception("YAO_API_ACCESS_KEY not equal token", 403);
  }
}
```

create new env config in .env file

```sh
YAO_API_ACCESS_KEY=123456
```

## use in browser

```html
<script type="module">
  import { YaoApplication } from "https://cdn.jsdelivr.net/npm/yao-app-client@1.0.6/+esm";

  const yao = new YaoApplication("/api/proxy/call", "123456");
  const models = await yao.Model("admin.user").Get({});
  console.log(models);
</script>
```

## use in bun

```sh
bun init

bun install yao-app-client
```

bun js demo code:

```js
import { YaoApplication } from "yao-app-client";
const yao = new YaoApplication(
  "http://localhost:5099/api/proxy/call",
  "123456"
);

/**
 * Model=> admin.user (用户表)
 *
 * Table=> admin_user (用户表)
 */
interface admin_user {
  /**ID */
  id?: number;
  /**类型 */
  type?: "super" | "admin" | "staff" | "user" | "robot";
  /**邮箱 */
  email?: string;
  /**手机号 */
  mobile?: string;
  /**登录密码 */
  password?: string;
  /**操作密码 */
  password2nd?: string;
  /**姓名 */
  name?: string;
  /**角色 */
  role?: any;
  /**状态 */
  status?: "enabled" | "disabled";
}
// define new user
const model = yao.Model < admin_user > "admin.user";
// create model
const id = await model.Create({
  name: "kaidi",
  email: "test@qq.com",
  mobile: "13956420154",
  type: "admin",
  status: "enabled",
});
console.log(`new user id:${id}`);
const models = await model.Get({});

console.log(models);
```

## bun application

build standalone binary using bun

```sh
bun build index.ts --compile --outfile yao-demo
```
