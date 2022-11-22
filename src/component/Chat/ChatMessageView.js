import React, { useEffect, useState, useRef } from "react";
import getConversationMessages from "./graphql/queries/getConversationMessages";
import subscribeToNewMessages from "./graphql/subscriptions/subscribeToNewMessages";
import { ApolloClientService } from "../../ApolloClientService";
import { unshiftMessage, pushMessages, constants } from "./chat-helper";
import { ObservableQuery } from "@apollo/client";
import moment from "moment";

function ChatMessageView(props) {
  const [messages, setMessages] = useState([]);
  // const [newMessage, setNewMessage] = useState("");
  const [nextToken, setNextToken] = useState("");
  const { currentUser, convos, isAdmin } = props;
  // const [currentUser, setCurrentUser] = useState();
  // const [convos, setConvos] = useState();
  // const [isAdmin, setIsAdmin] = useState();
  let fetchingMore = false;
  let completedFetching = false;
  // const [beforeScrollTop, setBeforeScrollTop] = useState();
  // const [lastScrollHeight, setLastScrollHeight] = useState();
  const [observedQuery, setObservedQuery] = useState({ ObservableQuery });
  const [lastMessage, setLastMessage] = useState(undefined);
  const [firstMessage, setFirstMessage] = useState(undefined);
  const client = ApolloClientService();
  const messagesEndRef = useRef(null);
  //let beforeScrollTop = 0
  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    // setBeforeScrollTop(messagesEndRef.current.scrollHeight)
  };

  useEffect(() => {
    console.log(convos);
    setMessages([]);
    setNextToken("");
    if (convos.id) {
      setLastMessage(undefined);
      setFirstMessage(undefined);
      const options = {
        query: getConversationMessages,
        fetchPolicy: "cache-and-network",
        variables: {
          conversationId: convos.id,
          first: constants.messageFirst,
        },
      };
      const observable = client.watchQuery(options);

      observable.subscribe(({ data }) => {
        console.log("chat-message-view: subscribe", data);
        if (!data) {
          return console.log("getConversationMessages - no data");
        }
        const newMessages = data.allMessageConnection.messages;
        setMessages([...newMessages].reverse());
        setNextToken(data.allMessageConnection.nextToken);
        console.log(
          "chat-message-view: nextToken is now",
          nextToken ? "set" : "null"
        );
      });

      observable.subscribeToMore({
        document: subscribeToNewMessages,
        variables: { conversationId: convos.id },
        updateQuery: (prev, { subscriptionData }) => {
          const message = subscriptionData.data.subscribeToNewMessage;
          console.log("subscribeToMore - updateQuery:", message);
          return unshiftMessage(prev, message);
        },
      });
      setObservedQuery(observable);
    }
  }, [convos.id]);

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
    // setBeforeScrollTop(messagesEndRef.current.scrollTop)
    // đoạn này update lại scrollTop mà em chưa biết làm
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [lastMessage]);

  function senderName(senderId) {
    if (senderId === currentUser.id) {
      return "You";
    } else {
      if (isAdmin) {
        return convos.name;
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
  async function loadMoreMessages(event = null) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!nextToken) {
      return;
    }
    console.time();
    const result = await observedQuery.fetchMore({
      variables: { after: nextToken },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        const res = pushMessages(
          prev,
          fetchMoreResult.allMessageConnection.messages,
          fetchMoreResult.allMessageConnection.nextToken
        );
        completedFetching = false;
        fetchingMore = true;
        return res;
      },
    });
    console.timeEnd();
    return result;
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
              <div key={m.id}>
                <div
                  className={
                    m.sender === currentUser.id
                      ? "chat-message-right pb-4"
                      : "chat-message-left pb-4"
                  }
                >
                  <div>
                    <div className="text-muted small text-nowrap mt-2">
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

export default ChatMessageView;
