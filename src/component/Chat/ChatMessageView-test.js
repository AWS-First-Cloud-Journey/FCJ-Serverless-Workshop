import React, {
  useEffect,
  useState,
  useRef
} from "react";
import getConversationMessages from "./graphql/queries/getConversationMessages";
import subscribeToNewMessages from "./graphql/subscriptions/subscribeToNewMessages";
import { ApolloClientService } from "../../ApolloClientService";
import { unshiftMessage, pushMessages, constants } from "./chat-helper";
import { ObservableQuery } from "@apollo/client";
import moment from "moment";

function ChatMessageViewTest(props) {
  const [messages, setMessages] = useState([]);
  // const [newMessage, setNewMessage] = useState("");
  const [nextToken, setNextToken] = useState("");
  const { currentUser, convos, isAdmin } = props;
  let fetchingMore = false;
  let completedFetching = false;
  const [observedQuery, setObservedQuery] = useState({ ObservableQuery });
  const [lastMessage, setLastMessage] = useState(undefined);
  const [firstMessage, setFirstMessage] = useState(undefined);
  const client = ApolloClientService();
  const messagesEndRef = useRef(null);
  //let beforeScrollTop = 0
  const scrollToBottom = () => {
    //messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  useEffect(() => {
    setMessages([
      {__typename: 'Message', id: '2022-11-03T07:56:31.212Z_642fd22f-e76b-494b-a847-2a88e5daeb7a', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: "I'm checkout yesterday", createdAt: '2022-11-03T07:56:31.212Z_642fd22f-e76b-494b-a847-2a88e5daeb7a', sender: "c1e6d654-9a3f-484b-ad54-861d2e9ce5ae"},
      {__typename: 'Message', id: '2022-11-03T07:49:52.079Z_960c5199-3389-4d65-b419-598357118f3e', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'Where is my order', createdAt: '2022-11-03T07:49:52.079Z_960c5199-3389-4d65-b419-598357118f3e', sender: "c1e6d654-9a3f-484b-ad54-861d2e9ce5ae"},
      {__typename: 'Message', id: '2022-11-03T04:22:59.866Z_a5d0c0c2-32de-4e72-810d-30f5a5a5b2a8', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'perfect, ideal society where everyone is happy and gets along with each other', createdAt: '2022-11-03T04:22:59.866Z_a5d0c0c2-32de-4e72-810d-30f5a5a5b2a8', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-11-03T04:22:45.780Z_d6aafa21-f58d-48a7-b23b-a6a089f6c727', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'small and insignificant, yet at the same time important, part of a whole', createdAt: '2022-11-03T04:22:45.780Z_d6aafa21-f58d-48a7-b23b-a6a089f6c727', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-11-03T04:22:36.409Z_5a174b71-5f50-413e-9b6f-30b3669a3422', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'conquer', createdAt: '2022-11-03T04:22:36.409Z_5a174b71-5f50-413e-9b6f-30b3669a3422', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-11-03T04:22:18.944Z_32ce0708-e843-43be-8f6f-dfedbe8439e9', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'utopia', createdAt: '2022-11-03T04:22:18.944Z_32ce0708-e843-43be-8f6f-dfedbe8439e9', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"}
    ])
  }, [convos]);

  function messageAdded(isFirst = false, message) {
    if (isFirst) {
      if (!firstMessage) {
        //firstMessage = message;
        setFirstMessage(message);
      } else if (firstMessage.id !== message.id) {
        setTimeout(() => {
          completedFetching = fetchingMore;
          fetchingMore = false;
        });
      }
    } else {
      if (!lastMessage || lastMessage.id !== message.id) {
        setLastMessage(message);
      }
      console.log("lastMessage", lastMessage);
    }
  }
  useEffect(() => {
    messages.map((m, index) => {
      let isLast = false;
      let isFirst = false;
      if (index === 0) isFirst = true;
      if (index === messages.length - 1) isLast = true;
      if (isFirst || isLast) messageAdded(isFirst, m);
    });
    messagesEndRef.current.scrollTop = 20;
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [lastMessage]);

  function senderName(senderId) {
    if (senderId === "2b13d621-eced-48c3-86f2-fe11e6513e2d") {
      return "You";
    } else {
      if (isAdmin) {
        return "Other user";
      } else {
        return "Admintrator";
      }
    }
  }
  function handleScroll(event) {
    let element = event.target;
    if (element.scrollTop === 0) {
      loadMoreMessages(event);
    }
  }
  function loadMoreMessages(event = null) {
    const oldMessages = [
      {__typename: 'Message', id: '2022-11-01T03:04:00.802Z_c6d551e7-0f20-4694-96f3-637e8d74d9b3', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'Sunshine', createdAt: '2022-11-01T03:04:00.802Z_c6d551e7-0f20-4694-96f3-637e8d74d9b3', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-11-01T02:43:28.260Z_73a101ff-c581-43bf-aa36-46ff7fb73b3b', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'Sunny', createdAt: '2022-11-01T02:43:28.260Z_73a101ff-c581-43bf-aa36-46ff7fb73b3b', sender: "c1e6d654-9a3f-484b-ad54-861d2e9ce5ae"},
      {__typename: 'Message', id: '2022-10-31T14:37:47.425Z_ce6e98b9-a340-4afb-9427-4d131321abca', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'G', createdAt: '2022-10-31T14:37:47.425Z_ce6e98b9-a340-4afb-9427-4d131321abca', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-10-31T14:36:16.184Z_fc1ea2e5-9aa9-4631-bebb-6b831822e812', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'H', createdAt: '2022-10-31T14:36:16.184Z_fc1ea2e5-9aa9-4631-bebb-6b831822e812', sender: "c1e6d654-9a3f-484b-ad54-861d2e9ce5ae"},
      {__typename: 'Message', id: '2022-10-31T10:55:08.789Z_4391a438-5034-491e-9fb6-16298986da17', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'M', createdAt: '2022-10-31T10:55:08.789Z_4391a438-5034-491e-9fb6-16298986da17', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-10-31T10:08:29.398Z_6ed78faa-eb82-4c85-84a5-e205f85444a4', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'Hi', createdAt: '2022-10-31T10:08:29.398Z_6ed78faa-eb82-4c85-84a5-e205f85444a4', sender: "c1e6d654-9a3f-484b-ad54-861d2e9ce5ae"},
      {__typename: 'Message', id: '2022-10-31T10:06:05.417Z_09891c4a-a119-4c11-8583-a605b9879828', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'Clo', createdAt: '2022-10-31T10:06:05.417Z_09891c4a-a119-4c11-8583-a605b9879828', sender: "2b13d621-eced-48c3-86f2-fe11e6513e2d"},
      {__typename: 'Message', id: '2022-10-31T09:53:54.741Z_d4fc43b8-9269-4be8-85b1-f2f0694b2c36', conversationId: '3dc80acf-9a0f-4aa0-bd1a-75bddc48a010', content: 'Blo', createdAt: '2022-10-31T09:53:54.741Z_d4fc43b8-9269-4be8-85b1-f2f0694b2c36', sender: "c1e6d654-9a3f-484b-ad54-861d2e9ce5ae"}
    ]

    setMessages([...oldMessages,...messages])
  }

  function transformDateTime(createAt) {
    const createdAt = createAt.split("_")[0];
    const date = moment(createdAt);
    return date.calendar(null, {
      sameDay: "LT",
      lastDay: "MMM D LT",
      lastWeek: "MMM D LT",
      sameElse: "l",
    });
  }

  return (
    <div>
      <div className="py-2 px-4 border-bottom d-none d-lg-block">
        <div className="d-flex align-items-center py-1">
          <div className="position-relative"></div>
          <div className="flex-grow-1 pl-3">
            <strong>{convos ? convos.name : "Choose conversation"}</strong>
          </div>
        </div>
      </div>
      <div className="position-relative">
        <div
          className="chat-messages p-4"
          ref={messagesEndRef}
          onScroll={handleScroll}
        >
          {messages &&
            messages.map((m) => (
              <div>
                <div
                  className={
                    m.sender === currentUser.id
                      ? "chat-message-right pb-4"
                      : "chat-message-left pb-4"
                  }
                >
                  <div>
                    <div class="text-muted small text-nowrap mt-2">
                      {transformDateTime(m.createdAt)}
                    </div>
                    <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                      <div className="fw-bold mb-1">{senderName(m.sender)}</div>
                      {m.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ChatMessageViewTest;
