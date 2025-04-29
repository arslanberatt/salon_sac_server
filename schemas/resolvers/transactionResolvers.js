const Transaction = require('../../models/Transaction');

const transactionResolvers = {
  Query: {
    transactions: async () => {
      return await Transaction.find();
    },
    transaction: async (_, { id }) => {
      return await Transaction.findById(id);
    },
  },

  Mutation: {
    addTransaction: async (
      _,
      { type, amount, description },
      { employeeAuth },
    ) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const newTransaction = new Transaction({
        type,
        amount,
        description,
        createdBy: employeeAuth.id,
      });

      return await newTransaction.save();
    },
    cancelTransaction: async (_, { id }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const transaction = await Transaction.findById(id);
      if (!transaction) {
        throw new Error('İşlem bulunamadı.');
      }

      transaction.canceled = true;
      await transaction.save();
      return transaction;
    },
  },
};

module.exports = transactionResolvers;
