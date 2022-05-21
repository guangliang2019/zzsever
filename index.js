const cloudbase = require("@cloudbase/node-sdk");
const { emit } = require("process");

const app = cloudbase.init({
  env: "yandadpt-1-12ce1b",
  secretId: "AKIDNWP5Wh3bGhwwgI506xhDcmhLkSXO8MSH",
  secretKey: "iCsBF5e2B4hQt87qUyEOUCfu4ye5GWTA",
});
// 1. 获取数据库引用
const db = app.database();

const _ = db.command;

const func2 = async (args) => {
  await app.callFunction({
    name: "addMessage",
    data: args,
  });
};

const { Server } = require("socket.io");
const PORT = 2334;
const io = new Server(PORT, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

console.log("server is running");

io.on("connection", async (socket) => {
  // setInterval(async ()=>{
  // await db
  //     .collection("messages")
  //     .where({
  //         roomId: "1",
  //     })
  //     .get()
  //     .then(r => {
  //         socket.emit("msg",r)
  //     });
  // },3000)
  // socket.emit("msg",func());
  socket.on("addmsg", async (args) => {
    console.log(args);
    await func2(args);
    await db
      .collection("messages")
      .where({
        roomId: args.roomId,
      })
      .get()
      .then((r) => {
        io.sockets.emit("msg", r);
      });
  });
  socket.on("getmsg", async (args) => {
    console.log(args);
    await db
      .collection("messages")
      .where({
        roomId: args.roomId,
      })
      .get()
      .then((r) => {
        io.sockets.emit("msg", r);
      });
  });
});

console.log("running2");
