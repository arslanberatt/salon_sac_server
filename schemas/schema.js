const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');

// Sadece Customer ve Service import edeceğiz!
const customerTypeDefs = require('./typeDefs/customerTypeDefs');
const serviceTypeDefs = require('./typeDefs/serviceTypeDefs');

const customerResolvers = require('./resolvers/customerResolvers');
const serviceResolvers = require('./resolvers/serviceResolvers');
const employeeTypeDefs = require('./typeDefs/employeeTypeDefs');
const employeeResolvers = require('./resolvers/employeeResolvers');

// TypeDefs'leri birleştiriyoruz
const typeDefs = mergeTypeDefs([
  customerTypeDefs,
  serviceTypeDefs,
  employeeTypeDefs,
]);

// Resolvers'ları birleştiriyoruz
const resolvers = mergeResolvers([
  customerResolvers,
  serviceResolvers,
  employeeResolvers,
]);

module.exports = { typeDefs, resolvers };
