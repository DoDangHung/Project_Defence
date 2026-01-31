import prisma from '../../config/db.js';

async function createMedicalRecord(data) {
  const { doctorId, patientId, diagnosis, treatment, notes, vitalSigns } = data;

  return prisma.$transaction(async (tx) => {
    const record = await tx.medicalRecord.create({
      data: {
        doctorId,
        patientId,
        diagnosis,
        treatment,
        notes,
      },
    });

    if (vitalSigns) {
      await tx.vitalSign.create({
        data: {
          medicalRecordId: record.id,
          systolic: vitalSigns.systolic,
          diastolic: vitalSigns.diastolic,
          heartRate: vitalSigns.heartRate,
          temperature: vitalSigns.temperature,
          weight: vitalSigns.weight,
          height: vitalSigns.height,
          bmi: vitalSigns.bmi,
          spo2: vitalSigns.spo2,
          bloodType: vitalSigns.bloodType,
        },
      });
    }

    return record;
  });
}

async function getMedicalRecordsByPatient(patientId) {
  return prisma.medicalRecord.findMany({
    where: { patientId },
    include: { vitalSign: true },
    orderBy: { date: 'desc' },
  });
}

async function getMedicalRecordDetail(id) {
  return prisma.medicalRecord.findUnique({
    where: { id },
    include: { vitalSign: true },
  });
}

export {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  getMedicalRecordDetail,
};
