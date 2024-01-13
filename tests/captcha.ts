import { YaoApplication } from "../src/yao";

//scripts.http.text
async function make() {
  const yao = new YaoApplication(
    "http://localhost:5099/api/proxy/call",
    "123456"
  );
  console.log(await yao.Utils().Captcha().Make());

  console.log(
    await yao.Utils().Captcha().Verify("ZZWq6FFdcKB4Izfjy8Ep", "xxxx")
  );
}

async function jwtmake() {
  const yao = new YaoApplication(
    "http://localhost:5099/api/proxy/call",
    "123456"
  );
  const jwtdata = await yao
    .Utils()
    .JwtMake(
      1,
      { name: "demo", option: "can", user: { id: 12 } },
      { timeout: 360000, expires_at: 1705495409 + 1000 }
    );
  console.log(jwtdata);

  const claim = await yao
    .Utils()
    .JwtValidate(jwtdata.token, new ArrayBuffer(0));
  console.log(claim);
}

await jwtmake();
