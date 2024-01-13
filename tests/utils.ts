import { YaoApplication } from "../src/yao";

//scripts.http.text
async function test1() {
    const yao = new YaoApplication("http://localhost:5099/api/proxy/call", "123456")
    console.log(await yao.Process("scripts.ts.test"))

}

//scripts.http.text
async function time() {
    const yao = new YaoApplication("http://localhost:5099/api/proxy/call", "123456")
    console.log(await yao.Utils().Now().Timestamp())
    console.log(await yao.Utils().Now().Timestampms())
    console.log(await yao.Utils().Now().Date())
    console.log(await yao.Utils().Now().DateTime())
    console.log(await yao.Utils().Now().Time())
}

await time()