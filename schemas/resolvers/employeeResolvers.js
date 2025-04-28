const Employee = require('../../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = employee => {
  return jwt.sign(
    { id: employee.id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
};

const employeeResolvers = {
  Query: {
    employees: async () => {
      return await Employee.find();
    },
    employee: async (_, { id }) => {
      return await Employee.findById(id);
    },
  },

  Mutation: {
    registerEmployee: async (_, { name, phone, email, password, role }) => {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        throw new Error('Bu email adresi zaten kayıtlı.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const employee = new Employee({
        name,
        phone,
        email,
        password: hashedPassword,
        role,
      });

      await employee.save();
      return employee;
    },

    loginEmployee: async (_, { email, password }) => {
      const employee = await Employee.findOne({ email });
      if (!employee) {
        throw new Error('Email bulunamadı.');
      }

      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        throw new Error('Şifre yanlış.');
      }

      const token = createToken(employee);

      return {
        token,
        employee,
      };
    },

    updateMyInfo: async (_, { name, phone, password }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const employee = await Employee.findById(employeeAuth.id);
      if (!employee) {
        throw new Error('Çalışan bulunamadı.');
      }

      if (name) employee.name = name;
      if (phone) employee.phone = phone;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(password, salt);
      }

      await employee.save();
      return employee;
    },

    updateEmployeeByPatron: async (
      _,
      { id, salary, commissionRate, advanceBalance },
      { employeeAuth },
    ) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const requester = await Employee.findById(employeeAuth.id);
      if (!requester || requester.role !== 'patron') {
        throw new Error('Sadece patron yetkilidir.');
      }

      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Çalışan bulunamadı.');
      }

      if (salary !== undefined) employee.salary = salary;
      if (commissionRate !== undefined)
        employee.commissionRate = commissionRate;
      if (advanceBalance !== undefined)
        employee.advanceBalance = advanceBalance;

      await employee.save();
      return employee;
    },

    updateEmployeeRole: async (_, { id, role }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const requester = await Employee.findById(employeeAuth.id);
      if (!requester || requester.role !== 'patron') {
        throw new Error('Sadece patron yetkilidir.');
      }

      const employee = await Employee.findById(id);
      if (!employee) {
        throw new Error('Çalışan bulunamadı.');
      }

      employee.role = role;
      await employee.save();
      return employee;
    },
  },
};

module.exports = employeeResolvers;
