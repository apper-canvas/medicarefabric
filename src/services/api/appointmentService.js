import appointmentData from '../mockData/appointments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let appointments = [...appointmentData];

export const getAll = async () => {
  await delay(250);
  return [...appointments];
};

export const getById = async (id) => {
  await delay(200);
  const appointment = appointments.find(a => a.id === id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  return { ...appointment };
};

export const create = async (appointmentData) => {
  await delay(400);
  const newAppointment = {
    ...appointmentData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  appointments = [newAppointment, ...appointments];
  return { ...newAppointment };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Appointment not found');
  }
  
  appointments[index] = {
    ...appointments[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...appointments[index] };
};

export const remove = async (id) => {
  await delay(300);
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Appointment not found');
  }
  
  appointments = appointments.filter(a => a.id !== id);
  return { success: true };
};