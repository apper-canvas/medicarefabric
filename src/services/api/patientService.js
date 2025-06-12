import patientData from '../mockData/patients.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let patients = [...patientData];

export const getAll = async () => {
  await delay(300);
  return [...patients];
};

export const getById = async (id) => {
  await delay(200);
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    throw new Error('Patient not found');
  }
  return { ...patient };
};

export const create = async (patientData) => {
  await delay(400);
  const newPatient = {
    ...patientData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  patients = [newPatient, ...patients];
  return { ...newPatient };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = patients.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Patient not found');
  }
  
  patients[index] = {
    ...patients[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...patients[index] };
};

export const remove = async (id) => {
  await delay(300);
  const index = patients.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Patient not found');
  }
  
  patients = patients.filter(p => p.id !== id);
  return { success: true };
};