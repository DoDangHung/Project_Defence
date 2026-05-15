import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/db.js';
// let tokenPatient1;
// let tokenPatient2;

// beforeAll(async () => {
//   // Login patient 1
//   const res1 = await request(app).post('/api/auth/login').send({
//     email: 'ferguson@example.com',
//     password: '123456',
//   });

//   tokenPatient1 = res1.body.token;

//   // Login patient 2
//   const res2 = await request(app).post('/api/auth/login').send({
//     email: 'alex@gmail.com',
//     password: '12345678',
//   });

//   tokenPatient2 = res2.body.token;
// });

// /* ===================== TC-F03 ===================== */
// describe('TC-F03 – FR-P5: Book appointment', () => {
//   test('Patient books available slot', async () => {
//     const res = await request(app)
//       .post('/api/appointments')
//       .set('Authorization', `Bearer ${tokenPatient1}`)
//       .send({
//         doctorId: 1,
//         patientId: 1,
//         clinicId: 1,
//         date: '2026-02-06T00:00:00.000Z',
//         startTime: '2026-02-06T15:00:00.000Z',
//         endTime: '2026-02-06T16:00:00.000Z',
//         reason: 'General checkup',
//       });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.data).toHaveProperty('id');
//   });
// });

// /* ===================== TC-F04 ===================== */
// describe('TC-F04 – FR-C1: Concurrent booking', () => {
//   test('Only one patient can book the same slot', async () => {
//     const payload = {
//       doctorId: 1,
//       date: '2026-02-11',
//       timeSlot: '10:00-10:30',
//       reason: 'Concurrent test',
//     };

//     const [res1, res2] = await Promise.all([
//       request(app)
//         .post('/api/appointments')
//         .set('Authorization', `Bearer ${tokenPatient1}`)
//         .send(payload),

//       request(app)
//         .post('/api/appointments')
//         .set('Authorization', `Bearer ${tokenPatient2}`)
//         .send(payload),
//     ]);

//     const codes = [res1.statusCode, res2.statusCode];

//     expect(codes.every((code) => code === 400 || code === 409)).toBe(true);

//     expect(codes).toContain(400); // hoặc 409
//   });
// });

// /* ===================== CLEANUP ===================== */
// afterAll(async () => {
//   // 🔴 DÒNG QUAN TRỌNG NHẤT
//   await prisma.$disconnect();
// });

/* ===================== TC-F05 – FR-D1 ===================== */
// describe('TC-F05 – FR-D1: Doctor sets weekly availability', () => {
//   let doctorToken;
//   let patientToken;
//   let doctorId;

//   beforeAll(async () => {
//     // 🔐 Login doctor
//     const doctorLogin = await request(app).post('/api/auth/login').send({
//       email: 'jack.doctor@gmail.com',
//       password: '123456',
//     });
//     console.log('DOCTOR LOGIN RESPONSE:', doctorLogin.body);

//     doctorToken = doctorLogin.body.data.token;
//     doctorId = doctorLogin.body.data.user.doctorId;

//     // 🔐 Login patient
//     const patientLogin = await request(app).post('/api/auth/login').send({
//       email: 'ferguson@example.com',
//       password: '123456',
//     });

//     patientToken = patientLogin.body.token;
//   });

//   test('Doctor creates weekly availability and patient can view it', async () => {
//     // 1️⃣ Doctor sets availability
//     const createRes = await request(app)
//       .post('/api/schedules/')
//       .set('Authorization', `Bearer ${doctorToken}`)
//       .send({
//         doctorId: 1,
//         roomId: 1,
//         date: '2026-02-08T00:00:00.000Z',
//         startTime: '2026-02-08T10:00:00.000Z',
//         endTime: '2026-02-07T16:00:00.000Z',
//         slotDuration: 60,
//       });

//     expect(createRes.statusCode).toBe(201);
//     expect(createRes.body.success).toBe(true);

//     // 2️⃣ Patient views availability
//     const viewRes = await request(app)
//       .get('/api/schedules/doctor')
//       .set('Authorization', `Bearer ${patientToken}`)
//       .query({
//         doctorId,
//         dayOfWeek: 'MONDAY',
//       });

//     expect(viewRes.statusCode).toBe(200);
//     expect(viewRes.body.success).toBe(true);

//     // 3️⃣ Check returned slots
//     expect(Array.isArray(viewRes.body.data)).toBe(true);
//     expect(viewRes.body.data.length).toBeGreaterThan(0);

//     // Check one slot structure
//     const slot = viewRes.body.data[0];
//     expect(slot).toHaveProperty('startTime');
//     expect(slot).toHaveProperty('endTime');
//   });
// });

// test('TC-S02 – lock after 6 failed attempts', async () => {
//   let res;

//   for (let i = 1; i <= 6; i++) {
//     res = await request(app).post('/api/auth/login').send({
//       email: 'jack.doctor@gmail.com',
//       password: 'wrongpassword',
//     });
//   }

//   expect(res.statusCode).toBe(429);
//   expect(res.body.message).toMatch(/too many/i);
// });

test('TC-S05 – SQL Injection attempt is blocked', async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: "' OR 1=1 --",
    password: 'anything',
  });

  expect(res.statusCode).toBe(401);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toMatch(/invalid email or password/i);
});
