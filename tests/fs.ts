import { YaoApplication } from "../src/yao";

//scripts.http.text
async function test() {
  const yao = new YaoApplication(
    "http://localhost:5099/api/proxy/call",
    "123456"
  );
  let test = await yao.FS("system").ReadFile("test.txt");
  console.log(test);
  // test = await yao.FS("system").ReadFileBuffer("test.txt");
  // console.log(Array.isArray(test));
  //   console.log(test);
}

test();
