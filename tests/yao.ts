import { YaoApplication } from "../src/yao";

function test() {
  return new YaoApplication("http://localhost:5099/api/proxy/call", "123456").Process(
    "models.admin.user.Get",
    {}
  );
}

interface User {
  name: string,
  email: string
}
async function test2() {
  const yao = new YaoApplication("http://localhost:5099/api/proxy/call", "123456")

  const model = yao.Model<User>('admin.user');
  const id = await model.Create({
    name: 'datao',
    email: "test.qq@qq.com"
  })
  // const m1 =  yao.model<User>('admin.user').Find(1,{})
  const m2 = await model.Get({
    select: ['name', 'email'],
    wheres: [{ column: 'name', op: 'ne', value: 'admin' }], orders: [
      { option: 'asc', column: 'name' }
    ]
  })
  console.log("m2", m2)
  console.log("find", await model.Find(id, {}))


  return m2
}
const data = await test2();

console.log(data);
