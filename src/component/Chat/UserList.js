import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import getAllUsers from "./graphql/queries/getAllUsers";
import createConversation from "./graphql/mutations/createConversation";
import getUserConversationsConnection from "./graphql/queries/getUserConversationsConnection";
import subscribeToNewUsers from "./graphql/subscriptions/subscribeToNewUsers";
import { ApolloClientService } from "./../../ApolloClientService";
import * as _ from "lodash";

function UserList(props) {
  //const { userId } = props
  const [users, setUsers] = React.useState([]);
  const { userId } = props;
  //const { loading, error, data, subscribeToMore } = useQuery(getAllUsers, {
  //fetchPolicy: 'cache-and-network'
  //})
  const client = ApolloClientService();
  const observable = client.watchQuery({
    query: getAllUsers,
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    console.log(userId);
    observable.subscribe(({data}) => {
        if (!data) {
          return console.log('getAllUsers - no data');
        }
        console.log(data)
        const userData = _(data.allUser).sortBy('username').reject(['id', userId]).value();
        setUsers(userData);
        console.log('getAllUsers - Got data', users);
    });
  }, []);

  // useEffect(() => {
  //     subscribeToMore({
  //         document: subscribeToNewUsers,
  //         updateQuery: (prev, { subscriptionData }) => {
  //             if (!subscriptionData.data) return prev;
  //             const newUser = subscriptionData.data.subscribeToNewUsers
  //             return [...prev, ...newUser]
  //         }
  //     })
  // }, []);
  var userElement = users.map((item) => {
    return <li className="list-group-item">{item.username}</li>;
  });
  return (
    <div>
      <span>Users</span>
      <ul className="list-group">{userElement}</ul>
    </div>
  );
}

export default UserList;
