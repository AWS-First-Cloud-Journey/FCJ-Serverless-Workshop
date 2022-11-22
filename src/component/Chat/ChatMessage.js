import React, {
  useEffect
} from "react";
import moment from "moment";

function ChatMessage(props) {
  const { sender, message } = props;
  useEffect(() => {
    if( isFirst || isLast ){
        messageAdded(isFirst, message);
    }
  }, [])

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
      <div
        className={
          sender === "You"
            ? "chat-message-right pb-4"
            : "chat-message-left pb-4"
        }
      >
        <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
          <div className="fw-bold mb-1">sender</div>
          {message.content}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
