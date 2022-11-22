import { gql } from '@apollo/client';

export default gql`
query getUsersByPosition($pos: String!) {
  allUsersByPosition(pos: $pos) {
    __typename
    id
    cognitoId
    username
  }
}`;