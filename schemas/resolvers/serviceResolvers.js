const Service = require('../../models/Service');

const serviceResolvers = {
  Query: {
    services: async () => {
      return await Service.find();
    },
    service: async (_, { id }) => {
      return await Service.findById(id);
    },
  },
  Mutation: {
    addService: async (_, { title, duration, price }) => {
      const newService = new Service({ title, duration, price });
      return await newService.save();
    },
    deleteService: async (_, { id }) => {
      return await Service.findByIdAndDelete(id);
    },
  },
};

module.exports = serviceResolvers;
