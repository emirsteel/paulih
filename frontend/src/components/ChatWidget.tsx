import React from 'react';

const ChatWidget: React.FC = () => {
  return (
    <div className="chat-widget">
      <h4>Chat with Friends</h4>
      {/* Example chat UI (replace with your chat logic) */}
      <div className="chat-box">
        <p><strong>Friend1:</strong> Hey, how are you?</p>
        <p><strong>You:</strong> I’m good, thanks! You?</p>
      </div>
    </div>
  );
};

export default ChatWidget;
