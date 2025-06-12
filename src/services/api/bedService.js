import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(320);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'ward', 'number', 'type', 'status', 'patient_id', 'last_cleaned'
      ]
    };
    
    const response = await apperClient.fetchRecords('bed', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching beds:", error);
    toast.error("Failed to fetch beds");
    return [];
  }
};

export const getById = async (id) => {
  await delay(200);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'ward', 'number', 'type', 'status', 'patient_id', 'last_cleaned'
      ]
    };
    
    const response = await apperClient.getRecordById('bed', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching bed with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (bedData) => {
  await delay(400);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const params = {
      records: [{
        Name: bedData.Name || `Bed ${bedData.number}`,
        Tags: bedData.Tags || '',
        Owner: bedData.Owner || '',
        ward: bedData.ward,
        number: bedData.number,
        type: bedData.type,
        status: bedData.status || 'available',
        patient_id: bedData.patientId ? parseInt(bedData.patientId) : (bedData.patient_id ? parseInt(bedData.patient_id) : null),
        last_cleaned: bedData.lastCleaned || bedData.last_cleaned || new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord('bed', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        return successfulRecords[0].data;
      }
    }
    
    throw new Error('Failed to create bed');
  } catch (error) {
    console.error("Error creating bed:", error);
    throw error;
  }
};

export const update = async (id, updateData) => {
  await delay(300);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields and Id
    const updateFields = {
      Id: parseInt(id)
    };
    
    // Add only the fields that are being updated
    if (updateData.Name !== undefined) updateFields.Name = updateData.Name;
    if (updateData.Tags !== undefined) updateFields.Tags = updateData.Tags;
    if (updateData.Owner !== undefined) updateFields.Owner = updateData.Owner;
    if (updateData.ward !== undefined) updateFields.ward = updateData.ward;
    if (updateData.number !== undefined) updateFields.number = updateData.number;
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.patient_id !== undefined) updateFields.patient_id = updateData.patient_id ? parseInt(updateData.patient_id) : null;
    if (updateData.patientId !== undefined) updateFields.patient_id = updateData.patientId ? parseInt(updateData.patientId) : null;
    if (updateData.last_cleaned !== undefined) updateFields.last_cleaned = updateData.last_cleaned;
    if (updateData.lastCleaned !== undefined) updateFields.last_cleaned = updateData.lastCleaned;
    
    const params = {
      records: [updateFields]
    };
    
    const response = await apperClient.updateRecord('bed', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        return successfulUpdates[0].data;
      }
    }
    
    throw new Error('Failed to update bed');
  } catch (error) {
    console.error("Error updating bed:", error);
    throw error;
  }
};

export const remove = async (id) => {
  await delay(300);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord('bed', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }
    
    return true;
  } catch (error) {
console.error("Error deleting bed:", error);
    throw error;
  }
};