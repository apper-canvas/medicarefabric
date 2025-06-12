import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(250);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
        'doctor_id', 'date_time', 'duration', 'type', 'status', 'department', 'room', 'notes', 'patient_id'
      ]
    };
    
    const response = await apperClient.fetchRecords('appointment', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error("Failed to fetch appointments");
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
        'doctor_id', 'date_time', 'duration', 'type', 'status', 'department', 'room', 'notes', 'patient_id'
      ]
    };
    
    const response = await apperClient.getRecordById('appointment', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    throw error;
  }
};

export const create = async (appointmentData) => {
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
        Name: appointmentData.Name || `Appointment - ${appointmentData.type}`,
        Tags: appointmentData.Tags || '',
        Owner: appointmentData.Owner || '',
        doctor_id: appointmentData.doctorId || appointmentData.doctor_id || appointmentData.doctorName,
        date_time: appointmentData.dateTime || appointmentData.date_time,
        duration: parseInt(appointmentData.duration) || 30,
        type: appointmentData.type,
        status: appointmentData.status || 'Scheduled',
        department: appointmentData.department || '',
        room: appointmentData.room || '',
        notes: appointmentData.notes || '',
        patient_id: parseInt(appointmentData.patientId) || parseInt(appointmentData.patient_id)
      }]
    };
    
    const response = await apperClient.createRecord('appointment', params);
    
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
    
    throw new Error('Failed to create appointment');
  } catch (error) {
    console.error("Error creating appointment:", error);
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
    if (updateData.doctor_id !== undefined) updateFields.doctor_id = updateData.doctor_id;
    if (updateData.date_time !== undefined) updateFields.date_time = updateData.date_time;
    if (updateData.duration !== undefined) updateFields.duration = parseInt(updateData.duration);
    if (updateData.type !== undefined) updateFields.type = updateData.type;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.department !== undefined) updateFields.department = updateData.department;
    if (updateData.room !== undefined) updateFields.room = updateData.room;
    if (updateData.notes !== undefined) updateFields.notes = updateData.notes;
    if (updateData.patient_id !== undefined) updateFields.patient_id = parseInt(updateData.patient_id);
    
    const params = {
      records: [updateFields]
    };
    
    const response = await apperClient.updateRecord('appointment', params);
    
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
    
    throw new Error('Failed to update appointment');
  } catch (error) {
    console.error("Error updating appointment:", error);
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
    
    const response = await apperClient.deleteRecord('appointment', params);
    
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
console.error("Error deleting appointment:", error);
    throw error;
  }
};