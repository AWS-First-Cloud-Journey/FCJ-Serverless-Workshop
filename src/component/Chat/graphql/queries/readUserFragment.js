import { gql } from '@apollo/client';

export default gql`
  fragment user on User {
    id
    cognitoId
    username
  }`;
