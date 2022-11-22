import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Auth } from 'aws-amplify';
import createUser from '../Chat/graphql/mutations/createUser'
import { ApolloLink } from "apollo-link";
import aws_config from "../../aws-exports";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { createAuthLink } from "aws-appsync-auth-link";
import awsExports from "../../aws-exports";
import Amplify from "@aws-amplify/core";
Amplify.configure(awsExports);

async function CreateUser() {
    const [user] = useMutation(createUser)
    //async function createNewUser(){
        const session = await Auth.currentSession()
        console.log(session)
        var new_user = {
            username : session.idToken.payload['email'],
            id: session.idToken.payload['sub'],
            cognitoId: session.idToken.payload['sub'],
            registered: true
        }
        
        user({
            variables : { username : session.idToken.payload['email'] },
            optimisticResponse: {
                createUser: {
                    ...new_user,
                    __typename: 'User'
                }
            }
        }).then(
            res => { console.log(res) },
            err => { console.log(err) }
        );
    //}
    //return (createNewUser)
}

const url = aws_config.aws_appsync_graphqlEndpoint;
const region = aws_config.aws_appsync_region;
async function getToken() {
  return (await Auth.currentSession()).getIdToken().getJwtToken();
}
const jwtToken = getToken();
const auth = {
  type: aws_config.aws_appsync_authenticationType,
  jwtToken: jwtToken
};
//console.log(jwtToken)
const link = ApolloLink.from([
   createAuthLink({ url, region, auth }),
   createHttpLink({ uri: url })
]);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})
  
const WithProvider = () => (
    <ApolloProvider client={ client }>
        <CreateUser />
    </ApolloProvider>
);

export default WithProvider