import aws_config from "./aws-exports";
import { Auth } from "aws-amplify";
import { createAuthLink } from "aws-appsync-auth-link";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';

export function ApolloClientService() {
  const url = aws_config.aws_appsync_graphqlEndpoint;
  const region = aws_config.aws_appsync_region;
  async function getToken() {
    return (await Auth.currentSession()).getIdToken().getJwtToken();
  }
  const jwtToken = getToken();

  const auth = {
    type: aws_config.aws_appsync_authenticationType,
    jwtToken: jwtToken,
  };
  //console.log(jwtToken);
  const httpLink = createHttpLink({ uri: url })
  const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    //createHttpLink({ uri: url }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink)
  ]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
  return client;
}
