import { gql } from '@apollo/client';

export default gql`
query getMe {
  me {
    __typename
    id
    cognitoId
    username
    registered
  }
}`;
