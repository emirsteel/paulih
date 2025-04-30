import { Server } from "socket.io";
import ChatMessage from "./models/chat.model";

const io = new Server();

export const initializeWebSocket = (server: any) => {
  io.attach(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a room (friend or group ID)
    socket.on("join", (roomId: string) => {
      if (roomId) {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
      }
    });

    socket.on("markAsSeen", async ({ senderId, receiverId }) => {
      try {
        await ChatMessage.updateMany(
          { sender: senderId, receiver: receiverId, seen: false },
          { seen: true }
        );
        // Notify sender that messages were seen
        io.to(senderId).emit("messagesSeen", { senderId, receiverId });
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, groupId, receiverId, message } = data;
      let newMessage;
      try {
        if (groupId) {
          newMessage = new ChatMessage({ sender: senderId, groupId, message });
          await newMessage.save();
          io.to(groupId).emit("receiveMessage", newMessage);
        } else if (receiverId) {
          newMessage = new ChatMessage({
            sender: senderId,
            receiver: receiverId,
            message,
          });
          await newMessage.save();
          // Emit only to the receiver room (so sender won't get a duplicate)
          io.to(receiverId).emit("receiveMessage", newMessage);
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // 1) Typing event
    socket.on("typing", ({ roomId, userId }) => {
      // Broadcast to everyone in the room (except sender) that userId is typing
      socket.to(roomId).emit("userTyping", { userId });
    });

    // 2) Stop typing event
    socket.on("stopTyping", ({ roomId, userId }) => {
      // Broadcast to everyone in the room (except sender) that userId stopped typing
      socket.to(roomId).emit("userStopTyping", { userId });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export default io;
