import * as update from "immutability-helper";

import _ from "lodash";

export const constants = {
  conversationFirst: 10,
  messageFirst: 10,
};

export function addConversation(data, uc) {
  if (!data || !_.has(data, "me.conversations.userConversations")) {
    return {
      me: {
        conversations: {
          nextToken: null,
          __typename: "UserConverstationsConnection",
          userConversations: [],
        },
      },
    };
  }

  if (
    data.me.conversations.userConversations.some(
      (_uc) => uc.conversationId === _uc.conversationId
    )
  ) {
    return data;
  }

  return update(data, {
    me: { conversations: { userConversations: { $push: [uc] } } },
  });
}
export function addUser(data, user) {
  if (!data || !data.allUser) {
    return { allUser: [] };
  }

  if (data.allUser.some((_user) => _user.id === user.id)) {
    return data;
  }

  return update(data, { allUser: { $push: [user] } });
}

export function unshiftMessage(data, message) {
  if (!data || !_.has(data, "allMessageConnection.messages")) {
    return {
      allMessageConnection: {
        nextToken: null,
        __typename: "MessageConnection",
        messages: [],
      },
    };
  }

  if (data.allMessageConnection.messages.some((m) => m.id === message.id)) {
    return data;
  }

  return update(data, {
    allMessageConnection: {
      messages: { $unshift: [message] },
    },
  });
}

export function pushMessages(data, messages, nextToken) {
  if (!data || !_.has(data, "allMessageConnection.messages")) {
    return {
      allMessageConnection: {
        nextToken: null,
        __typename: "MessageConnection",
        messages: [],
      },
    };
  }

  return update(data, {
    allMessageConnection: {
      messages: { $push: messages },
      nextToken: { $set: nextToken },
    },
  });
}

export function pushConvos(data, convos, nextToken) {
  if (!data || !_.has(data, "me.conversations.userConversations")) {
    return {
      me: {
        conversations: {
          nextToken: null,
          __typename: "UserConverstationsConnection",
          userConversations: [],
        },
      },
    };
  }

  return update(data, {
    me: { conversations: {
      userConversations: { $push: convos },
      nextToken: { $set: nextToken },
    }
    },
  });
}
