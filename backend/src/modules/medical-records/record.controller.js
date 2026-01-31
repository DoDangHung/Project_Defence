const service = require('../medical-records/record.service.js');

async function create(req, res) {
  try {
    const record = await service.createMedicalRecord(req.body);
    res.status(201).json({
      message: 'Medical record created successfully',
      data: record,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Create medical record failed' });
  }
}

async function getByPatient(req, res) {
  try {
    const patientId = Number(req.params.patientId);
    const records = await service.getMedicalRecordsByPatient(patientId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Get medical records failed' });
  }
}

async function getDetail(req, res) {
  try {
    const id = Number(req.params.id);
    const record = await service.getMedicalRecordDetail(id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Get medical record failed' });
  }
}

module.exports = {
  create,
  getByPatient,
  getDetail,
};
