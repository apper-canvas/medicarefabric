import { toast } from 'react-toastify';

// Utility function to add delay for better UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(300);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Get all fields from staff table
    const tableFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'role', 'department', 'specialization', 'availability', 'current_patients'
    ];
    
    const params = {
      fields: tableFields,
      orderBy: [{ fieldName: "Name", SortType: "ASC" }],
      pagingInfo: { limit: 100, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords('staff', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database response to UI format
    return (response.data || []).map(staff => ({
      id: staff.Id,
      name: staff.Name || '',
      role: staff.role || '',
      department: staff.department || '',
      specialization: staff.specialization || '',
      availability: staff.availability || '',
      currentPatients: staff.current_patients ? staff.current_patients.split(', ') : [],
      tags: staff.Tags || '',
      owner: staff.Owner || '',
      createdOn: staff.CreatedOn,
      modifiedOn: staff.ModifiedOn
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    toast.error("Failed to load staff");
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
    
    const tableFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'role', 'department', 'specialization', 'availability', 'current_patients'
    ];
    
    const params = { fields: tableFields };
    const response = await apperClient.getRecordById('staff', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (!response.data) {
      return null;
    }
    
    const staff = response.data;
    return {
      id: staff.Id,
      name: staff.Name || '',
      role: staff.role || '',
      department: staff.department || '',
      specialization: staff.specialization || '',
      availability: staff.availability || '',
      currentPatients: staff.current_patients ? staff.current_patients.split(', ') : [],
      tags: staff.Tags || '',
      owner: staff.Owner || '',
      createdOn: staff.CreatedOn,
      modifiedOn: staff.ModifiedOn
    };
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    toast.error("Failed to load staff details");
    return null;
  }
};

export const create = async (staffData) => {
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
        Name: staffData.Name || staffData.name,
        Tags: staffData.Tags || '',
        Owner: staffData.Owner || '',
        role: staffData.role,
        department: staffData.department,
        specialization: staffData.specialization || '',
        availability: staffData.availability || '',
        current_patients: Array.isArray(staffData.currentPatients) ? staffData.currentPatients.join(', ') : (staffData.current_patients || '')
      }]
    };
    
    const response = await apperClient.createRecord('staff', params);
    
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
    
    throw new Error('Failed to create staff');
  } catch (error) {
    console.error("Error creating staff:", error);
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
    if (updateData.role !== undefined) updateFields.role = updateData.role;
    if (updateData.department !== undefined) updateFields.department = updateData.department;
    if (updateData.specialization !== undefined) updateFields.specialization = updateData.specialization;
    if (updateData.availability !== undefined) updateFields.availability = updateData.availability;
    if (updateData.current_patients !== undefined) updateFields.current_patients = updateData.current_patients;
    if (updateData.currentPatients !== undefined) updateFields.current_patients = Array.isArray(updateData.currentPatients) ? updateData.currentPatients.join(', ') : updateData.currentPatients;
    
    const params = {
      records: [updateFields]
    };
    
    const response = await apperClient.updateRecord('staff', params);
    
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
    
    throw new Error('Failed to update staff');
  } catch (error) {
    console.error("Error updating staff:", error);
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
    
    const response = await apperClient.deleteRecord('staff', params);
    
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
    
    return false;
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};