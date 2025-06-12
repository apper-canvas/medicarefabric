import bedData from '../mockData/beds.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let beds = [...bedData];

export const getAll = async () => {
  await delay(320);
  return [...beds];
};

export const getById = async (id) => {
  await delay(200);
  const bed = beds.find(b => b.id === id);
  if (!bed) {
    throw new Error('Bed not found');
  }
  return { ...bed };
};

export const create = async (bedData) => {
  await delay(400);
  const newBed = {
    ...bedData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  beds = [newBed, ...beds];
  return { ...newBed };
};

export const update = async (id, updateData) => {
  await delay(300);
  const index = beds.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Bed not found');
  }
  
  beds[index] = {
    ...beds[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return { ...beds[index] };
};

export const remove = async (id) => {
  await delay(300);
  const index = beds.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Bed not found');
  }
  
  beds = beds.filter(b => b.id !== id);
  return { success: true };
};