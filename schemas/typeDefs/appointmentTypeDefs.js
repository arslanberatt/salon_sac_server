const { gql } = require('apollo-server-express');

const appointmentTypeDefs = gql`
  type Appointment {
    id: ID!
    customerId: ID!
    employeeId: ID!
    serviceIds: [ID!]!
    startTime: String!
    endTime: String!
    status: String!
    totalPrice: Float!
    notes: String
    createdAt: String
  }

  type Query {
    appointments: [Appointment] # Otomatik patron/çalışan kontrolü yapılacak
    appointmentsByStatus(status: String!): [Appointment]
    appointment(id: ID!): Appointment
  }

  type Mutation {
    addAppointment(
      customerId: ID!
      employeeId: ID!
      serviceIds: [ID!]!
      startTime: String!
      totalPrice: Float!
      notes: String
    ): Appointment

    updateAppointmentStatus(id: ID!, status: String!): Appointment
  }
`;

module.exports = appointmentTypeDefs;
