import React, { useEffect, useState } from "react";
import { fetchAllUnreadMessages, markMessagesAsSeen } from "../services/api";

interface ChatMessage {
  _id: string;
  sender: string; // Assuming sender is stored as an ID string
  message: string;
  timestamp: string;
}

interface UnreadCount {
  sender: string;
  count: number;
}

const GetUnreadMessages = () => {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount[]>([]);

  const loadUnreadMessages = async () => {
    try {
      const messages: ChatMessage[] = await fetchAllUnreadMessages();
      const counts: { [key: string]: number } = {};
      messages.forEach((msg) => {
        counts[msg.sender] = (counts[msg.sender] || 0) + 1;
      });
      const countsArray = Object.keys(counts).map((sender) => ({
        sender,
        count: counts[sender],
      }));
      setUnreadCounts(countsArray);
    } catch (error) {
      console.error("Error loading unread messages:", error);
    }
  };

  useEffect(() => {
    loadUnreadMessages();
    const interval = setInterval(loadUnreadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsSeen = async (sender: string) => {
    try {
      await markMessagesAsSeen(sender);
      setUnreadCounts((prev) => prev.filter((item) => item.sender !== sender));
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  return (
    <div>
      <h2>Unread Message Counts</h2>
      {unreadCounts.length === 0 ? (
        <p>No unread messages.</p>
      ) : (
        <ul>
          {unreadCounts.map((item) => (
            <li key={item.sender}>
              <span>From: {item.sender}</span>
              <span> — Count: {item.count}</span>
              <button onClick={() => handleMarkAsSeen(item.sender)}>
                Mark as Seen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetUnreadMessages;
