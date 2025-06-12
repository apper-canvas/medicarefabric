import staffData from '../mockData/staff.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let staff = [...staffData];

export const getAll = async () => {
  await delay(280);
  return [...staff];
};

export const getById = async (id) => {
  await delay(200);
  const member = staff.find(s => s.id === id);
  if (!member) {
    throw new Error('Staff member not found');
  }
  return { ...member };
};

export const create = async (staffData) => {
  await delay(400);
  const newStaff = {
    ...staffData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  staff = [newStaff, ...staff];
  return { ...newStaff };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = staff.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Staff member not found');
  }
  
  staff[index] = {
    ...staff[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...staff[index] };
};

export const remove = async (id) => {
  await delay(300);
  const index = staff.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Staff member not found');
  }
  
  staff = staff.filter(s => s.id !== id);
  return { success: true };
};