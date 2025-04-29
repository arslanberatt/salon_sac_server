const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');

// Sadece Customer ve Service import edeceğiz!
const customerTypeDefs = require('./typeDefs/customerTypeDefs');
const serviceTypeDefs = require('./typeDefs/serviceTypeDefs');

const customerResolvers = require('./resolvers/customerResolvers');
const serviceResolvers = require('./resolvers/serviceResolvers');
const employeeTypeDefs = require('./typeDefs/employeeTypeDefs');
const employeeResolvers = require('./resolvers/employeeResolvers');
const appointmentTypeDefs = require('./typeDefs/appointmentTypeDefs');
const appointmentResolvers = require('./resolvers/appointmentResolvers');
const transactionTypeDefs = require('./typeDefs/transactionTypeDefs');
const salaryRecordTypeDefs = require('./typeDefs/salaryRecordTypeDefs');
const advanceRequestTypeDefs = require('./typeDefs/advanceRequestTypeDefs');
const transactionResolvers = require('./resolvers/transactionResolvers');
const salaryRecordResolvers = require('./resolvers/salaryRecordResolvers');
const advanceRequestResolvers = require('./resolvers/advanceRequestResolvers');

// TypeDefs'leri birleştiriyoruz
const typeDefs = mergeTypeDefs([
  customerTypeDefs,
  serviceTypeDefs,
  employeeTypeDefs,
  appointmentTypeDefs,
  transactionTypeDefs,
  salaryRecordTypeDefs,
  advanceRequestTypeDefs,
]);

// Resolvers'ları birleştiriyoruz
const resolvers = mergeResolvers([
  customerResolvers,
  serviceResolvers,
  employeeResolvers,
  appointmentResolvers,
  transactionResolvers,
  salaryRecordResolvers,
  advanceRequestResolvers,
]);

module.exports = { typeDefs, resolvers };
