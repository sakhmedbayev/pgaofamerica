/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlayer = `query GetPlayer($score: Int!, $lastname: String!) {
  getPlayer(score: $score, lastname: $lastname) {
    name
    lastname
    score
  }
}
`;
export const listPlayers = `query ListPlayers(
  $score: Int
  $lastname: ModelStringKeyConditionInput
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPlayers(
    score: $score
    lastname: $lastname
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      name
      lastname
      score
    }
    nextToken
  }
}
`;
export const searchPlayers = `query SearchPlayers(
  $filter: SearchablePlayerFilterInput
  $sort: SearchablePlayerSortInput
  $limit: Int
  $nextToken: String
) {
  searchPlayers(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      name
      lastname
      score
    }
    nextToken
  }
}
`;
