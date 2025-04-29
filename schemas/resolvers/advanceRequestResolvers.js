const AdvanceRequest = require('../../models/AdvanceRequest');
const SalaryRecord = require('../../models/SalaryRecord');
const Transaction = require('../../models/Transaction');

const advanceRequestResolvers = {
  Query: {
    advanceRequests: async () => {
      return await AdvanceRequest.find();
    },
    pendingAdvanceRequests: async () => {
      return await AdvanceRequest.find({ status: 'beklemede' });
    },
  },

  Mutation: {
    createAdvanceRequest: async (_, { amount, reason }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const newRequest = new AdvanceRequest({
        employeeId: employeeAuth.id,
        amount,
        reason,
      });

      return await newRequest.save();
    },

    approveAdvanceRequest: async (_, { id }, { employeeAuth }) => {
      if (!employeeAuth || employeeAuth.role !== 'patron') {
        throw new Error('Sadece patron onaylayabilir.');
      }

      const request = await AdvanceRequest.findById(id);
      if (!request || request.status !== 'beklemede') {
        throw new Error('Geçersiz veya zaten işlenmiş talep.');
      }

      request.status = 'onaylandi';
      await request.save();

      // Onaylanınca SalaryRecord ve Transaction oluştur
      await SalaryRecord.create({
        employeeId: request.employeeId,
        type: 'avans',
        amount: request.amount,
        description: `Avans Ödemesi - Onaylanan talep`,
        approved: true,
      });

      await Transaction.create({
        type: 'gider',
        amount: request.amount,
        description: `Avans Ödemesi - Onaylanan talep`,
        createdBy: employeeAuth.id,
      });

      return request;
    },

    rejectAdvanceRequest: async (_, { id }, { employeeAuth }) => {
      if (!employeeAuth || employeeAuth.role !== 'patron') {
        throw new Error('Sadece patron reddedebilir.');
      }

      const request = await AdvanceRequest.findById(id);
      if (!request || request.status !== 'beklemede') {
        throw new Error('Geçersiz veya zaten işlenmiş talep.');
      }

      request.status = 'reddedildi';
      await request.save();
      return request;
    },
  },
};

module.exports = advanceRequestResolvers;
