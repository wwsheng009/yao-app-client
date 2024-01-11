import { YaoApplication } from "../src/yao";


//scripts.http.text
function test() {
    const yao = new YaoApplication("http://localhost:5099/api/proxy/call", "123456")
    return yao.Model('admin.user').Get({})
}

console.log(await test())