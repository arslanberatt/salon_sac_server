const Employee = require('../models/Employee');

const resetEmployeeBalances = async () => {
  try {
    await Employee.updateMany(
      {},
      {
        $set: {
          salary: 0,
          advanceBalance: 0,
        },
      },
    );

    console.log('🔔 Tüm çalışanların maaş ve avans bakiyeleri sıfırlandı.');
  } catch (error) {
    console.error('Resetleme sırasında hata oluştu:', error.message);
  }
};

module.exports = { resetEmployeeBalances };
