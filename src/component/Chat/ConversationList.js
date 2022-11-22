import React, { useEffect } from "react";
import subscribeToNewUserConversations from "./graphql/subscriptions/subscribeToNewUserConversations";
import createUserConversations from "./graphql/mutations/createUserConversations";
import getUserConversationsConnection from "./graphql/queries/getUserConversationsConnection";
import createConversation from "./graphql/mutations/createConversation";
import getUsersByPosition from "./graphql/queries/getUsersByPosition";
import { constants, addConversation, pushConvos } from "./chat-helper";
import { ApolloClientService } from "./../../ApolloClientService";
import _ from "lodash";
import { v4 as uuid } from "uuid";
import { ObservableQuery } from "@apollo/client";

function ConversationList(props) {
  const [nextToken, setNextToken] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [conversations, setConversations] = React.useState([]);
  const client = ApolloClientService();
  const { currentUser, isAdmin, setConvos } = props;
  const [observedQuery, setObservedQuery] = React.useState({ObservableQuery});

  useEffect(() => {
    if (!isAdmin) {
      client
        .query({
          query: getUsersByPosition,
          variables: {
            pos: "admin",
          },
        })
        .then((res) => {
          setUsers(res.data.allUsersByPosition);
        });
    } else {
      const observable = client.watchQuery({
        query: getUserConversationsConnection,
        variables: { first: constants.conversationFirst},
        fetchPolicy: 'cache-and-network'
      });
      console.log(observable)
      observable.subscribe(({data}) => {
        console.log('Fetched convos data', data);
        if (!data || !data.me) { return console.log('getUserConversationsConnection: no data'); }
        setConversations(
          data.me.conversations.userConversations
            .map((u) => u.conversation)
            .filter((c) => c)
        );
        setNextToken(data.me.conversations.nextToken);
        console.log('Fetched convos', conversations);
      });

      observable.subscribeToMore({
        document: subscribeToNewUserConversations,
        variables: { 'userId': currentUser.id },
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) return prev;
          const userConvo = subscriptionData.data.subscribeToNewUCs
          console.log('updateQuery on convo subscription', userConvo);
          return Object.assign({}, prev,
              addConversation(prev, userConvo)
          );
        }
      })
      setObservedQuery(observable)
    }
  }, []);

  async function createNewConversation(index, e) {
    //e.preventDefault();
    const userConvos = await client.query({
      query: getUserConversationsConnection,
      variables: { first: constants.conversationFirst },
    });
    console.log(userConvos);
    const path = "me.conversations.userConversations";
    const userConvo = _.chain(userConvos.data)
      .get(path)
      .find((c) => _.some(c.associated, ["userId", currentUser.id]))
      .value();
    console.log(userConvo);
    if (userConvo) {
      setConvos(userConvo.conversation);
      return;
    }

    const newConvo = {
      id: uuid(),
      name: currentUser.username,
      createdAt: `${Date.now()}`,
    };

    client
      .mutate({
        mutation: createConversation,
        variables: newConvo,
      })
      .then(() => createUserConvo(client, users[index].id, newConvo.id))
      .then(() => createUserConvo(client, currentUser.id, newConvo.id, true))
      .then(() => setConvos(newConvo))
      .catch((err) => console.log("create convo error", err));
  }

  // async function loadMoreConvos(event) {
  //   if (event) {
  //     event.stopPropagation();
  //     event.preventDefault();
  //   }
  //   if (!nextToken) {
  //     return;
  //   }
  //   const result = await observedQuery.fetchMore({
  //     variables: { after: nextToken },
  //     updateQuery: (prev, { fetchMoreResult }) => {
  //       if (!fetchMoreResult) {
  //         return prev;
  //       }
  //       const res = pushConvos(
  //         prev,
  //         fetchMoreResult.data.me.conversations.userConversations,
  //         fetchMoreResult.data.me.conversations.nextToken
  //       );
  //       return res;
  //     },
  //   });
  // }

  function createUserConvo(client, id, convoId, update = false) {
    const options = {
      mutation: createUserConversations,
      variables: { userId: id, conversationId: convoId },
      ...(!update
        ? {}
        : {
            update(proxy, { data: { createUserConversations: userConvo } }) {
              console.log("createUserConvo - update fn:", userConvo);

              const _options = {
                query: getUserConversationsConnection,
                variables: { first: constants.conversationFirst },
              };

              const prev = proxy.readQuery(_options);
              const data = addConversation(prev, userConvo);
              proxy.writeQuery({ ..._options, data });
            },
          }),
    };
    return client.mutate(options);
  }

  function handleConversations(index, e) {
    const convosInfor = {
      id: conversations[index].id,
      name: conversations[index].name,
    };

    setConvos(convosInfor);
  }

  return (
    <div className="people-list">
      <div className="px-4 d-none d-md-block">
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <input
              type="text"
              className="form-control my-3"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
      {!isAdmin && (
        <li
          className="list-group-item list-group-item-action border-0 border-bottom"
          onClick={() => createNewConversation(0)}
        >
          <div className="d-flex align-items-start">
            <div className="flex-grow-1 ml-3">
              Admintrator
              <div className="small"></div>
            </div>
          </div>
        </li>
      )}
      {isAdmin &&
        conversations.map((u, index) => (
          <li
            key={u.id}
            className="list-group-item list-group-item-action border-0 border-bottom"
            onClick={() => handleConversations(index)}
          >
            <div className="d-flex align-items-start">
              <div className="flex-grow-1 ml-3">
                {u.name}
                <div className="small"></div>
              </div>
            </div>
          </li>
        ))}

      <hr className="d-block d-lg-none mt-1 mb-0" />
    </div>
  );
}

export default ConversationList;
