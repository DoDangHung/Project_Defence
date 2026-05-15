/** @format */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAppointmentConfirmation = async (
  appointment,
  patient,
  doctor,
  clinic,
) => {
  const appointmentDate = new Date(appointment.date).toLocaleDateString(
    "vi-VN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const startTime = new Date(appointment.startTime).toLocaleTimeString(
    "vi-VN",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const endTime = new Date(appointment.endTime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Appointment Confirmation</h2>
      
      <p>Xin chào <strong>${patient.user?.firstName || ""} ${patient.user?.lastName || ""}</strong>,</p>
      
      <p>You have successfully booked an appointment. Details:</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>📅 Appointment Date:</strong> ${appointmentDate}</p>
        <p><strong>⏰ Appointment Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>👨‍⚕️ Doctor:</strong> BS. ${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}</p>
        <p><strong>🏥 Clinic:</strong> ${clinic.name || ""}</p>
        ${clinic.address ? `<p><strong>📍 Address:</strong> ${clinic.address}</p>` : ""}
        <p><strong>🔢 Queue Number:</strong> ${appointment.queueNumber}</p>
        ${appointment.reason ? `<p><strong>Reason:</strong> ${appointment.reason}</p>` : ""}
      </div>
      
      <p style="color: #dc2626;"><strong>Important Notes:</strong></p>
      <ul>
        <li>Please arrive 15 minutes before the appointment</li>
        <li>Bring your ID card and health insurance card (if applicable)</li>
        <li>If you need to cancel/change the appointment, please notify before 24 hours</li>
      </ul>
      
      <p style="margin-top: 30px;">Thank you,<br><strong>Appointment Booking System</strong></p>
    </div>
  `;

  const textContent = `
  Appointment confirmed.
Hello ${patient.user?.firstName || ""} ${patient.user?.lastName || ""},

  Details:
  - Appointment Date: ${appointmentDate}
  - Appointment Time: ${startTime} - ${endTime}
  - Doctor: BS. ${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}
  - Clinic: ${clinic.name || ""}
  ${clinic.address ? `- Address: ${clinic.address}` : ""}
  - Queue Number: ${appointment.queueNumber}
  ${appointment.reason ? `- Reason: ${appointment.reason}` : ""}

  Important Notes:
  - Please arrive 15 minutes before the appointment
  - Bring your ID card and health insurance card (if applicable)
  - If you need to cancel/change the appointment, please notify before 24 hours

  Thank you,
  Appointment Booking System
  `;

  const patientEmail = patient.user?.email;
  if (!patientEmail) {
    console.log("Patient email not found, skipping email notification");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Appointment Booking System" <${process.env.SMTP_USER || "noreply@clinic.com"}>`,
      to: patientEmail,
      subject: `Appointment Confirmation - ${appointmentDate}`,
      text: textContent,
      html: htmlContent,
    });
    console.log(
      `Email sent to ${patientEmail} for appointment ${appointment.id}`,
    );
  } catch (error) {
    console.error("Failed to send confirmation email:", error.message);
  }
};

export default { sendAppointmentConfirmation };
