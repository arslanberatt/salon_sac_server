const Appointment = require('../../models/Appointment');
const Service = require('../../models/Service');
const Transaction = require('../../models/Transaction');
const Employee = require('../../models/Employee'); // 🔥 Çalışan bilgisi için
const SalaryRecord = require('../../models/SalaryRecord'); // 🔥 Prim kaydı için

const appointmentResolvers = {
  Query: {
    appointments: async (_, __, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      if (employeeAuth.role === 'patron') {
        return await Appointment.find();
      } else {
        return await Appointment.find({ employeeId: employeeAuth.id });
      }
    },

    appointmentsByStatus: async (_, { status }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      if (employeeAuth.role === 'patron') {
        return await Appointment.find({ status });
      } else {
        return await Appointment.find({ employeeId: employeeAuth.id, status });
      }
    },

    appointment: async (_, { id }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error('Randevu bulunamadı.');
      }

      if (
        employeeAuth.role !== 'patron' &&
        appointment.employeeId.toString() !== employeeAuth.id
      ) {
        throw new Error('Bu randevuyu görüntülemeye yetkiniz yok.');
      }

      return appointment;
    },
  },

  Mutation: {
    addAppointment: async (
      _,
      { customerId, employeeId, serviceIds, startTime, totalPrice, notes },
      { employeeAuth },
    ) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      if (employeeAuth.role !== 'patron' && employeeAuth.id !== employeeId) {
        throw new Error('Çalışan sadece kendi adına randevu oluşturabilir.');
      }

      const services = await Service.find({ _id: { $in: serviceIds } });
      if (!services.length) {
        throw new Error('Geçerli hizmet bulunamadı.');
      }

      const totalDurationMinutes = services.reduce(
        (sum, service) => sum + service.duration,
        0,
      );
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(
        startDateTime.getTime() + totalDurationMinutes * 60000,
      );

      const newAppointment = new Appointment({
        customerId,
        employeeId,
        serviceIds,
        startTime: startDateTime,
        endTime: endDateTime,
        totalPrice,
        notes,
      });

      return await newAppointment.save();
    },

    updateAppointmentStatus: async (_, { id, status }, { employeeAuth }) => {
      if (!employeeAuth) {
        throw new Error('Yetkisiz işlem.');
      }

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        throw new Error('Randevu bulunamadı.');
      }

      if (
        employeeAuth.role !== 'patron' &&
        appointment.employeeId.toString() !== employeeAuth.id
      ) {
        throw new Error('Bu randevuyu güncellemeye yetkiniz yok.');
      }

      appointment.status = status;
      await appointment.save();

      if (status === 'tamamlandi') {
        // 🔥 GELİR TRANSACTION EKLE
        await Transaction.create({
          type: 'gelir',
          amount: appointment.totalPrice,
          description: `Randevu Ödemesi`,
          createdBy: employeeAuth.id,
        });

        // 🔥 ÇALIŞANIN PRİMİNİ EKLE
        const employee = await Employee.findById(appointment.employeeId);
        if (employee && employee.commissionRate) {
          const commissionAmount =
            appointment.totalPrice * (employee.commissionRate / 100);

          // Çalışanın maaşına prim ekle
          employee.salary = (employee.salary || 0) + commissionAmount;
          await employee.save();

          // SalaryRecord içine prim kaydı oluştur
          await SalaryRecord.create({
            employeeId: employee.id,
            type: 'prim',
            amount: commissionAmount,
            description: `Randevu Primi`,
            approved: true,
          });
        }
      }

      if (status === 'iptal') {
        await Transaction.updateMany(
          {
            type: 'gelir',
            amount: appointment.totalPrice,
            createdBy: appointment.employeeId,
            canceled: false,
          },
          { $set: { canceled: true } },
        );
      }

      return appointment;
    },
  },
};

module.exports = appointmentResolvers;
