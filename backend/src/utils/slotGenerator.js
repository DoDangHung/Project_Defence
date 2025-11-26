export function generateTimeSlots(startTime, endTime, slotMinutes = 30) {
  const slots = [];
  let current = new Date(startTime);
  const end = new Date(endTime);

  while (current < end) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + slotMinutes * 60000);

    if (slotEnd <= end) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
      });
    }
    current = slotEnd;
  }
  return slots;
}
