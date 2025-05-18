const { gql } = require('apollo-server-express');

const transactionTypeDefs = gql`
  type Transaction {
    id: ID!
    type: String!
    amount: Float!
    description: String!
    date: String
    createdBy: Employee!
    createdAt: String
    canceled: Boolean
  }

  type Query {
    transactions: [Transaction]
    transaction(id: ID!): Transaction
  }

  type Mutation {
    addTransaction(
      type: String!
      amount: Float!
      description: String!
    ): Transaction
    cancelTransaction(id: ID!): Transaction
  }
`;

module.exports = transactionTypeDefs;
