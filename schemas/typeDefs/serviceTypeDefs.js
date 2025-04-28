const { gql } = require('apollo-server-express');

const serviceTypeDefs = gql`
  type Service {
    id: ID!
    title: String!
    duration: Int!
    price: Float!
    createdAt: String
  }

  type Query {
    services: [Service]
    service(id: ID!): Service
  }

  type Mutation {
    addService(title: String!, duration: Int!, price: Float!): Service
    deleteService(id: ID!): Service
  }
`;

module.exports = serviceTypeDefs;
