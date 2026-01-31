const express = require('express');
const controller = require('../medical-records/record.controller.js');

const router = express.Router();

router.post('/', controller.create);
router.get('/patient/:patientId', controller.getByPatient);
router.get('/:id', controller.getDetail);

module.exports = router;
