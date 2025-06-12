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
    
    // Get all fields from patient table
    const tableFields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
      'first_name', 'last_name', 'date_of_birth', 'gender', 'phone', 'email', 'address',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
      'medical_history', 'current_status', 'admission_date', 'department', 'assigned_doctor', 'bed_number'
    ];
    
    const params = {
      fields: tableFields,
      orderBy: [{ fieldName: "CreatedOn", SortType: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords('patient', params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database response to UI format
    return (response.data || []).map(patient => ({
      id: patient.Id,
      name: patient.Name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      firstName: patient.first_name || '',
      lastName: patient.last_name || '',
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      emergencyContact: {
        name: patient.emergency_contact_name || '',
        phone: patient.emergency_contact_phone || '',
        relationship: patient.emergency_contact_relationship || ''
      },
      medicalHistory: patient.medical_history ? patient.medical_history.split(', ') : [],
      currentStatus: patient.current_status || 'admitted',
      admissionDate: patient.admission_date,
      department: patient.department || '',
      assignedDoctor: patient.assigned_doctor || '',
      bedNumber: patient.bed_number || '',
      tags: patient.Tags || '',
      owner: patient.Owner || '',
      createdOn: patient.CreatedOn,
      modifiedOn: patient.ModifiedOn
    }));
  } catch (error) {
    console.error("Error fetching patients:", error);
    toast.error("Failed to load patients");
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
      'first_name', 'last_name', 'date_of_birth', 'gender', 'phone', 'email', 'address',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
      'medical_history', 'current_status', 'admission_date', 'department', 'assigned_doctor', 'bed_number'
    ];
    
    const params = { fields: tableFields };
    const response = await apperClient.getRecordById('patient', parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (!response.data) {
      return null;
    }
    
    const patient = response.data;
    return {
      id: patient.Id,
      name: patient.Name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      firstName: patient.first_name || '',
      lastName: patient.last_name || '',
      dateOfBirth: patient.date_of_birth,
      gender: patient.gender,
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      emergencyContact: {
        name: patient.emergency_contact_name || '',
        phone: patient.emergency_contact_phone || '',
        relationship: patient.emergency_contact_relationship || ''
      },
      medicalHistory: patient.medical_history ? patient.medical_history.split(', ') : [],
      currentStatus: patient.current_status || 'admitted',
      admissionDate: patient.admission_date,
      department: patient.department || '',
      assignedDoctor: patient.assigned_doctor || '',
      bedNumber: patient.bed_number || '',
      tags: patient.Tags || '',
      owner: patient.Owner || '',
      createdOn: patient.CreatedOn,
      modifiedOn: patient.ModifiedOn
    };
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error);
    toast.error("Failed to load patient details");
    return null;
  }
};

export const create = async (patientData) => {
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
        Name: `${patientData.firstName || patientData.first_name} ${patientData.lastName || patientData.last_name}`,
        Tags: patientData.Tags || '',
        Owner: patientData.Owner || '',
        first_name: patientData.firstName || patientData.first_name,
        last_name: patientData.lastName || patientData.last_name,
        date_of_birth: patientData.dateOfBirth || patientData.date_of_birth,
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email || '',
        address: patientData.address || '',
        emergency_contact_name: patientData.emergencyContact?.name || patientData.emergency_contact_name || '',
        emergency_contact_phone: patientData.emergencyContact?.phone || patientData.emergency_contact_phone || '',
        emergency_contact_relationship: patientData.emergencyContact?.relationship || patientData.emergency_contact_relationship || '',
        medical_history: Array.isArray(patientData.medicalHistory) ? patientData.medicalHistory.join(', ') : (patientData.medical_history || ''),
        current_status: patientData.currentStatus || patientData.current_status || 'admitted',
        admission_date: patientData.admissionDate || patientData.admission_date || new Date().toISOString(),
        department: patientData.department,
        assigned_doctor: patientData.assignedDoctor || patientData.assigned_doctor,
        bed_number: patientData.bedNumber || patientData.bed_number || ''
      }]
    };
    
    const response = await apperClient.createRecord('patient', params);
    
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
    
    throw new Error('Failed to create patient');
  } catch (error) {
    console.error("Error creating patient:", error);
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
    if (updateData.first_name !== undefined) updateFields.first_name = updateData.first_name;
    if (updateData.last_name !== undefined) updateFields.last_name = updateData.last_name;
    if (updateData.date_of_birth !== undefined) updateFields.date_of_birth = updateData.date_of_birth;
    if (updateData.gender !== undefined) updateFields.gender = updateData.gender;
    if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
    if (updateData.email !== undefined) updateFields.email = updateData.email;
    if (updateData.address !== undefined) updateFields.address = updateData.address;
    if (updateData.emergency_contact_name !== undefined) updateFields.emergency_contact_name = updateData.emergency_contact_name;
    if (updateData.emergency_contact_phone !== undefined) updateFields.emergency_contact_phone = updateData.emergency_contact_phone;
    if (updateData.emergency_contact_relationship !== undefined) updateFields.emergency_contact_relationship = updateData.emergency_contact_relationship;
    if (updateData.medical_history !== undefined) updateFields.medical_history = updateData.medical_history;
    if (updateData.current_status !== undefined) updateFields.current_status = updateData.current_status;
    if (updateData.currentStatus !== undefined) updateFields.current_status = updateData.currentStatus;
    if (updateData.admission_date !== undefined) updateFields.admission_date = updateData.admission_date;
    if (updateData.department !== undefined) updateFields.department = updateData.department;
    if (updateData.assigned_doctor !== undefined) updateFields.assigned_doctor = updateData.assigned_doctor;
    if (updateData.bed_number !== undefined) updateFields.bed_number = updateData.bed_number;
    
    const params = {
      records: [updateFields]
    };
    
    const response = await apperClient.updateRecord('patient', params);
    
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
    
    throw new Error('Failed to update patient');
  } catch (error) {
    console.error("Error updating patient:", error);
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
    
    const response = await apperClient.deleteRecord('patient', params);
    
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
    console.error("Error deleting patient:", error);
    throw error;
  }
};