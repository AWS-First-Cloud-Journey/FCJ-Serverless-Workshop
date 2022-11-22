import { gql } from '@apollo/client';

export default gql`
mutation createUserConversations($conversationId: ID!, $userId: ID!) {
  createUserConversations(conversationId: $conversationId, userId: $userId) {
    __typename
    userId
    conversationId
    conversation {
      __typename
      id
      name
    }
    associated {
      __typename
      userId
    }
  }
}
`;
