const Service = require('../../models/Service');

const serviceResolvers = {
  Query: {
    services: async () => await Service.find(),
    service: async (_, { id }) => await Service.findById(id),
  },

  Mutation: {
    addService: async (_, { title, duration, price }) => {
      const newService = new Service({ title, duration, price });
      return await newService.save();
    },
    deleteService: async (_, { id }) => {
      return await Service.findByIdAndDelete(id);
    },
    updateServicePrice: async (_, { id, price }) => {
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { price },
        { new: true },
      );
      return updatedService;
    },
  },
};

module.exports = serviceResolvers;
