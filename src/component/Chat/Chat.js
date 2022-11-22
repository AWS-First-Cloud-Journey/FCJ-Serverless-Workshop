import React, { useEffect } from "react";
import ChatMessageView from "./ChatMessageView";
import UserList from "./UserList";
import ChatInput from "./ChatInput";
import ConversationList from "./ConversationList";
import "./ChatMessageView.css";

function Chat(props) {
  const { currentUser, isAdmin } = props;
  const [convos, setConvos] = React.useState({
    id: "",
    name: ""
  });

  return (
    <div className="container p-0">
      <h1 className="h3 mb-3">Messages</h1>
      <div className="card">
        <div className="row g-0">
          <div className="col-12 col-lg-5 col-xl-3 border">
            <ConversationList
              currentUser={currentUser}
              isAdmin={isAdmin}
              setConvos={setConvos}
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-9 border">
            <ChatMessageView
              currentUser={currentUser}
              convos={convos}
              isAdmin={isAdmin}
            />
            <ChatInput convos={convos} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
