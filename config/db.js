const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB bağlantısı başarılı ✅'.cyan.underline);
  } catch (error) {
    console.error('MongoDB bağlantı hatası ❌', error.message.red.bold);
    process.exit(1); // Bağlantı hatasında server'ı kapat
  }
};

module.exports = connectDb;
