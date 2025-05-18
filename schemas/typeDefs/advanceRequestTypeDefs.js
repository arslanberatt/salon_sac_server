const { gql } = require('apollo-server-express');

const advanceRequestTypeDefs = gql`
  type AdvanceRequest {
    id: ID!
    employeeId: ID!
    employee: Employee!
    amount: Float!
    reason: String
    status: String!
    createdAt: String
  }

  type Query {
    advanceRequests: [AdvanceRequest]
    pendingAdvanceRequests: [AdvanceRequest]
  }

  type Mutation {
    createAdvanceRequest(amount: Float!, reason: String): AdvanceRequest
    approveAdvanceRequest(id: ID!): AdvanceRequest
    rejectAdvanceRequest(id: ID!): AdvanceRequest
  }
`;

module.exports = advanceRequestTypeDefs;
