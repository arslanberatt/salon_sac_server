const { gql } = require('apollo-server-express');

const customerTypeDefs = gql`
  type Customer {
    id: ID!
    name: String!
    phone: String!
    notes: String
    createdAt: String
  }

  type Query {
    customers: [Customer]
    customer(id: ID!): Customer
  }

  type Mutation {
    addCustomer(name: String!, phone: String!, notes: String): Customer
    deleteCustomer(id: ID!): Customer
  }
`;

module.exports = customerTypeDefs;
