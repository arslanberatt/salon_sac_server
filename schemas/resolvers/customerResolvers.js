const Customer = require('../../models/Customer');

const customerResolvers = {
  Query: {
    customers: async () => {
      return await Customer.find();
    },
    customer: async (_, { id }) => {
      return await Customer.findById(id);
    },
  },
  Mutation: {
    addCustomer: async (_, { name, phone, notes }) => {
      const newCustomer = new Customer({ name, phone, notes });
      return await newCustomer.save();
    },
    deleteCustomer: async (_, { id }) => {
      return await Customer.findByIdAndDelete(id);
    },
  },
};

module.exports = customerResolvers;
