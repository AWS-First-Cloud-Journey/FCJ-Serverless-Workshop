import { gql } from '@apollo/client'

export default gql`
mutation createUser($username: String!, $position: String) {
  createUser(username: $username, position: $position) {
    __typename
    cognitoId
    username
    registered
    id
  }
}`;
