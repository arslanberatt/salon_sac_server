const SalaryRecord = require('../../models/SalaryRecord');
// const Employee = require('../../models/Employee');

const salaryRecordResolvers = {
  Query: {
    salaryRecords: async () => {
      return await SalaryRecord.find();
    },
    salaryRecord: async (_, { id }) => {
      return await SalaryRecord.findById(id);
    },
  },

  Mutation: {
    addSalaryRecord: async (
      _,
      { employeeId, type, amount, description },
      { employeeAuth },
    ) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const salaryRecord = new SalaryRecord({
        employeeId,
        type,
        amount,
        description,
        approved: employeeAuth.role === 'patron' ? true : false,
      });

      return await salaryRecord.save();
    },

    approveSalaryRecord: async (_, { id }, { employeeAuth }) => {
      if (!employeeAuth || employeeAuth.role !== 'patron') {
        throw new Error('Sadece patron onay verebilir.');
      }

      const record = await SalaryRecord.findById(id);
      if (!record) {
        throw new Error('Kayıt bulunamadı.');
      }

      record.approved = true;
      await record.save();
      return record;
    },

    // resetEmployeeBalances: async (_, __, { employeeAuth }) => {
    //   if (!employeeAuth || employeeAuth.role !== 'patron') {
    //     throw new Error('Sadece patron bu işlemi yapabilir.');
    //   }

    //   await Employee.updateMany(
    //     {},
    //     {
    //       $set: {
    //         salary: 0,
    //         advanceBalance: 0,
    //       },
    //     },
    //   );

    //   return 'Tüm çalışanların maaş ve avans bakiyeleri başarıyla sıfırlandı.';
    // },
  },
};

module.exports = salaryRecordResolvers;
