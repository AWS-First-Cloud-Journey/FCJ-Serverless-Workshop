import React, { useState, useEffect } from "react";
import { ApolloClientService } from "../../ApolloClientService";
import createMessage from "./graphql/mutations/createMessage";
import getConversationMessages from "./graphql/queries/getConversationMessages";
import { unshiftMessage, pushMessages, constants } from "./chat-helper";
import { v4 as uuid } from "uuid";
import SendIcon from "@material-ui/icons/Send";

function ChatInput(props) {
  const { convos, currentUser } = props;
  const [newMessage, setNewMessage] = useState("")
  const client = ApolloClientService();
  async function createNewMessage(e) {
    if (e.key !== 'Enter'){
      return;
    }
    if (!newMessage || newMessage.trim().length === 0) {
      setNewMessage("");
      return;
    }
    const id = `${new Date().toISOString()}_${uuid()}`;
    const message = {
      conversationId: convos.id,
      content: newMessage,
      createdAt: id,
      sender: currentUser.id,
      isSent: false,
      id: id,
    };
    console.log("new message", message);
    client
      .mutate({
        mutation: createMessage,
        variables: message,

        optimisticResponse: () => ({
          createMessage: {
            ...message,
            __typename: "Message",
          },
        }),

        update: (proxy, { data: { createMessage: _message } }) => {
          const options = {
            query: getConversationMessages,
            variables: {
              conversationId: convos.id,
              first: constants.messageFirst,
            },
          };

          const data = proxy.readQuery(options);
          const _tmp = unshiftMessage(data, _message);
          proxy.writeQuery({ ...options, data: _tmp });
        },
      })
      .then(({ data }) => {
        console.log("mutation complete", data);
      })
      .catch((err) => console.log("Error creating message", err));
      setNewMessage("");
  }
  return (
    <div className="flex-grow-0 py-3 px-4 border-top">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message"
          onKeyUp={createNewMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <span className="input-group-text" onClick={createNewMessage}>
          <SendIcon />
        </span>
      </div>
    </div>
  );
}

export default ChatInput;
