const Appointment = require('../../models/Appointment');
const Service = require('../../models/Service');
const Transaction = require('../../models/Transaction');
const Employee = require('../../models/Employee');
const SalaryRecord = require('../../models/SalaryRecord');

const appointmentResolvers = {
  Query: {
    appointments: async (_, __, { employeeAuth }) => {
      if (!employeeAuth) throw new Error('Yetkisiz işlem.');
      return employeeAuth.role === 'patron'
        ? await Appointment.find()
        : await Appointment.find({ employeeId: employeeAuth.id });
    },

    appointmentsByStatus: async (_, { status }, { employeeAuth }) => {
      if (!employeeAuth) throw new Error('Yetkisiz işlem.');
      return employeeAuth.role === 'patron'
        ? await Appointment.find({ status })
        : await Appointment.find({ employeeId: employeeAuth.id, status });
    },

    appointment: async (_, { id }, { employeeAuth }) => {
      if (!employeeAuth) throw new Error('Yetkisiz işlem.');

      const appointment = await Appointment.findById(id);
      if (!appointment) throw new Error('Randevu bulunamadı.');

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
      if (!employeeAuth) throw new Error('Yetkisiz işlem.');

      if (employeeAuth.role !== 'patron' && employeeAuth.id !== employeeId) {
        throw new Error('Çalışan sadece kendi adına randevu oluşturabilir.');
      }

      const services = await Service.find({ _id: { $in: serviceIds } });
      if (!services.length) throw new Error('Geçerli hizmet bulunamadı.');

      const totalDurationMinutes = services.reduce(
        (sum, service) => sum + service.duration,
        0,
      );

      const startDateTime = new Date(startTime); // UTC
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

    updateAppointment: async (
      _,
      { id, startTime, notes },
      { employeeAuth },
    ) => {
      if (!employeeAuth) throw new Error('Yetkisiz işlem.');

      const appointment = await Appointment.findById(id);
      if (!appointment) throw new Error('Randevu bulunamadı.');

      if (
        employeeAuth.role !== 'patron' &&
        appointment.employeeId.toString() !== employeeAuth.id
      ) {
        throw new Error('Bu randevuyu güncellemeye yetkiniz yok.');
      }

      // 🔄 StartTime güncelleme
      if (startTime) {
        const newStart = new Date(startTime);

        // 🔁 Güncel hizmetleri bul ve total süre hesapla
        const services = await Service.find({
          _id: { $in: appointment.serviceIds },
        });
        const totalDurationMinutes = services.reduce(
          (sum, s) => sum + (s.duration || 0),
          0,
        );

        const newEnd = new Date(
          newStart.getTime() + totalDurationMinutes * 60000,
        );

        appointment.startTime = newStart;
        appointment.endTime = newEnd;
      }

      if (typeof notes === 'string') {
        appointment.notes = notes;
      }

      await appointment.save();
      return appointment;
    },

    updateAppointmentStatus: async (
      _,
      { id, status, totalPrice },
      { employeeAuth },
    ) => {
      if (!employeeAuth) throw new Error('Yetkisiz işlem.');

      const appointment = await Appointment.findById(id);
      if (!appointment) throw new Error('Randevu bulunamadı.');

      if (
        employeeAuth.role !== 'patron' &&
        appointment.employeeId.toString() !== employeeAuth.id
      ) {
        throw new Error('Bu randevuyu güncellemeye yetkiniz yok.');
      }

      if (appointment.status === 'tamamlandi') {
        throw new Error('Bu randevu zaten tamamlanmış ve güncellenemez.');
      }

      appointment.status = status;

      if (status === 'tamamlandi') {
        if (typeof totalPrice === 'number') {
          appointment.totalPrice = totalPrice;
        }

        await appointment.save();

        await Transaction.create({
          type: 'gelir',
          amount: appointment.totalPrice,
          description: 'Randevu Ödemesi',
          createdBy: employeeAuth.id,
        });

        const employee = await Employee.findById(appointment.employeeId);
        if (employee?.commissionRate) {
          const commissionAmount =
            appointment.totalPrice * (employee.commissionRate / 100);

          employee.salary = (employee.salary || 0) + commissionAmount;
          await employee.save();

          await SalaryRecord.create({
            employeeId: employee.id,
            type: 'prim',
            amount: commissionAmount,
            description: 'Randevu Primi',
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

      await appointment.save();
      return appointment;
    },
  },
};

module.exports = appointmentResolvers;
