const { gql } = require('apollo-server-express');

const salaryRecordTypeDefs = gql`
  type SalaryRecord {
    id: ID!
    employeeId: ID!
    type: String!
    amount: Float!
    description: String!
    date: String
    approved: Boolean
    createdAt: String
  }

  type Query {
    salaryRecords: [SalaryRecord]
    salaryRecord(id: ID!): SalaryRecord
  }

  type Mutation {
    addSalaryRecord(
      employeeId: ID!
      type: String!
      amount: Float!
      description: String!
    ): SalaryRecord
    approveSalaryRecord(id: ID!): SalaryRecord
    #resetEmployeeBalances: String # 🔥 yeni eklenen mutation
  }
`;

module.exports = salaryRecordTypeDefs;
