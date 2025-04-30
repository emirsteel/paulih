import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";
import RightSidebar from "../components/ChatRightSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatPage: React.FC = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showChatList, setShowChatList] = useState(false);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setSelectedGroup(null);
    setShowChatList(false); // Hide chat list after selecting
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedFriend(null);
    setShowChatList(false); // Hide chat list after selecting
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Chat List - Hidden on small, visible on md and up */}
      <div className="hidden md:flex">
        <ChatList
          onSelectFriend={handleSelectFriend}
          onSelectGroup={handleSelectGroup}
        />
      </div>

      {/* Mobile Chat List Drawer */}
      {showChatList && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setShowChatList(false)}
          />
          <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 sm:hidden shadow-lg">
            <ChatList
              onSelectFriend={handleSelectFriend}
              onSelectGroup={handleSelectGroup}
            />
          </div>
        </>
      )}

      {/* Chat Box */}
      <div className="flex flex-col w-full md:w-[60%]">
        <ChatBox
          friend={selectedFriend}
          group={selectedGroup}
          onSelectFriend={handleSelectFriend}
          onSelectGroup={handleSelectGroup}
          showChatList={showChatList}
          setShowChatList={setShowChatList}
        />
      </div>

      {/* Right Sidebar - visible on lg and up */}
      <div className="hidden lg:block w-full lg:w-[320px]">
        <RightSidebar friend={selectedFriend} group={selectedGroup} />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ChatPage;
