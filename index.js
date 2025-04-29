const express = require('express');
const cors = require('cors');
require('dotenv').config();
const colors = require('colors');
const connectDb = require('./config/db');
const { graphqlHTTP } = require('express-graphql');
const { typeDefs, resolvers } = require('./schemas/schema');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const Employee = require('./models/Employee');
const jwt = require('jsonwebtoken');

// 🔥 Cron ve reset servisini import ediyoruz
const cron = require('node-cron');
const { resetEmployeeBalances } = require('./services/resetService');

const app = express();
app.use(cors());
connectDb();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// 🔥 Ayın 1'inde gece 00:00'da çalışan reset sistemi
cron.schedule('0 0 1 * *', async () => {
  console.log(
    "🗓 Ayın 1'i geldi! Çalışan maaş ve avans bakiyeleri sıfırlanıyor...",
  );
  await resetEmployeeBalances();
});

app.use(
  '/graphql',
  graphqlHTTP(async req => {
    let employeeAuth = null;

    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employee = await Employee.findById(decoded.id);
        if (employee) {
          employeeAuth = {
            id: employee.id,
            role: employee.role,
          };
        }
      } catch (err) {
        console.log('Token doğrulanamadı:', err.message);
      }
    }

    return {
      schema,
      graphiql: process.env.NODE_ENV === 'development',
      context: { employeeAuth },
    };
  }),
);

// Server başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `🚀 Server ${PORT} portunda ${process.env.NODE_ENV} modunda çalışıyor...`
      .blue.underline,
  ),
);
