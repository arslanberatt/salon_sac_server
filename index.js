const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const colors = require('colors');
const connectDb = require('./config/db');
const { graphqlHTTP } = require('express-graphql');
const { typeDefs, resolvers } = require('./schemas/schema');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const Employee = require('./models/Employee');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
// const { resetEmployeeBalances } = require('./services/resetService');

const app = express();

// 🌐 Güvenlik ve istek limiti middleware'leri
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 dakika
    max: 1000, // max 100 istek
    message: '⚠️ Çok fazla istek gönderdiniz, lütfen sonra tekrar deneyin.',
  }),
);

// 🌐 Veritabanı bağlantısı
connectDb();

// 🔧 GraphQL Schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  );
  next();
});

// 🕐 Her ayın 1'inde çalışan maaş sıfırlama cron job
// cron.schedule('0 0 1 * *', async () => {
//   console.log(
//     "🗓 Ayın 1'i geldi! Çalışan maaş ve avans bakiyeleri sıfırlanıyor...",
//   );
//   await resetEmployeeBalances();
// });

// 🔐 JWT doğrulama ve GraphQL endpoint
app.use('/graphql', async (req, res, next) => {
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
      console.log('🔐 Token doğrulanamadı:', err.message);
    }
  }

  graphqlHTTP({
    schema,
    graphiql: true,
    context: { employeeAuth },
  })(req, res, next);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `🚀 Server ${PORT} portunda ${process.env.NODE_ENV} modunda çalışıyor...`
      .blue.underline,
  ),
);
