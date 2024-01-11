import { Process } from "../src/process";
import type { YaoQueryParam } from "yao-app-ts-types";
import { YaoApplication } from "../src/yao";

function test1() {
  const yao = new YaoApplication("http://localhost:5099/api/proxy/call", "123456")
  return yao.Process("utils.env.Get", "YAO_SESSION_FILE")

}
function test() {
  //  Process("models.admin.Get",{wheres:[{column:"x",op:'eq'}]} as YaoQueryParam.QueryParam);
  //  Process("models.xx.Get",{});
  //  Process("scripts.xxx",{})
  return Process("models.admin.user.Paginate", {}, 1, 10)
}
const data = await test1();

console.log(data);
