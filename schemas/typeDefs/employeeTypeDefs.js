const { gql } = require('apollo-server-express');

const employeeTypeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    phone: String!
    email: String!
    role: String!
    salary: Float
    commissionRate: Float
    advanceBalance: Float
    createdAt: String
  }

  type AuthPayload {
    token: String!
    employee: Employee!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    registerEmployee(
      name: String!
      phone: String!
      email: String!
      password: String!
      role: String
    ): Employee

    loginEmployee(email: String!, password: String!): AuthPayload

    updateMyInfo(name: String, phone: String, password: String): Employee

    updateEmployeeByPatron(
      id: ID!
      salary: Float
      commissionRate: Float
      advanceBalance: Float
    ): Employee

    updateEmployeeRole(id: ID!, role: String!): Employee
  }
`;

module.exports = employeeTypeDefs;
