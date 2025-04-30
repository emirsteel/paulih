import express, { Request, Response } from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Simulated chatbot response
app.post("/chatbot", (req: Request, res: Response) => {
  const userMessage: string = req.body.message;
  res.json({ reply: `Bot: "${userMessage}" mesajınızı aldım.` });
});

// Live Chat WebSocket
io.on("connection", (socket: Socket) => {
  console.log("Yeni bir kullanıcı bağlandı");

  socket.on("sendMessage", (data: { sender: string; text: string }) => {
    io.emit("receiveMessage", data); // Send message to all connected users
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});

server.listen(5001, () => console.log("Server 5001 portunda çalışıyor"));
