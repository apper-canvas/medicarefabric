import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';

const EditPatientForm = ({ isOpen, onClose, onSubmit, patient }) => {
  const [editPatient, setEditPatient] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    department: '',
    assignedDoctor: '',
    emergencyContact: { name: '', phone: '', relationship: '' }
  });

  const departments = ['Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'ICU'];
  const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];

  useEffect(() => {
    if (patient) {
      setEditPatient({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        department: patient.department || '',
        assignedDoctor: patient.assignedDoctor || '',
        emergencyContact: {
          name: patient.emergencyContact?.name || '',
          phone: patient.emergencyContact?.phone || '',
          relationship: patient.emergencyContact?.relationship || ''
        }
      });
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert UI format to database format
    const updateData = {
      Name: `${editPatient.firstName} ${editPatient.lastName}`,
      first_name: editPatient.firstName,
      last_name: editPatient.lastName,
      date_of_birth: editPatient.dateOfBirth,
      gender: editPatient.gender,
      phone: editPatient.phone,
      email: editPatient.email,
      address: editPatient.address,
      department: editPatient.department,
      assigned_doctor: editPatient.assignedDoctor,
      emergency_contact_name: editPatient.emergencyContact.name,
      emergency_contact_phone: editPatient.emergencyContact.phone,
      emergency_contact_relationship: editPatient.emergencyContact.relationship
    };
    
    await onSubmit(updateData);
  };

  const handlePatientChange = (field, value) => {
    setEditPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setEditPatient(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value }
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <Text as="h2" className="text-xl font-semibold text-surface-900">Edit Patient Information</Text>
                  <Button onClick={onClose} variant="secondary" className="p-2">
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    id="firstName"
                    type="text"
                    value={editPatient.firstName}
                    onChange={(e) => handlePatientChange('firstName', e.target.value)}
                    required
                  />
                  <FormField
                    label="Last Name"
                    id="lastName"
                    type="text"
                    value={editPatient.lastName}
                    onChange={(e) => handlePatientChange('lastName', e.target.value)}
                    required
                  />
                  <FormField
                    label="Date of Birth"
                    id="dateOfBirth"
                    type="date"
                    value={editPatient.dateOfBirth}
                    onChange={(e) => handlePatientChange('dateOfBirth', e.target.value)}
                    required
                  />
                  <FormField
                    label="Gender"
                    id="gender"
                    type="select"
                    value={editPatient.gender}
                    onChange={(e) => handlePatientChange('gender', e.target.value)}
                    options={genders}
                    placeholder="Select Gender"
                    required
                  />
                  <FormField
                    label="Phone"
                    id="phone"
                    type="tel"
                    value={editPatient.phone}
                    onChange={(e) => handlePatientChange('phone', e.target.value)}
                    required
                  />
                  <FormField
                    label="Email"
                    id="email"
                    type="email"
                    value={editPatient.email}
                    onChange={(e) => handlePatientChange('email', e.target.value)}
                  />
                  <FormField
                    label="Department"
                    id="department"
                    type="select"
                    value={editPatient.department}
                    onChange={(e) => handlePatientChange('department', e.target.value)}
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    placeholder="Select Department"
                    required
                  />
                  <FormField
                    label="Assigned Doctor"
                    id="assignedDoctor"
                    type="text"
                    value={editPatient.assignedDoctor}
                    onChange={(e) => handlePatientChange('assignedDoctor', e.target.value)}
                    required
                  />
                </div>

                <FormField
                  label="Address"
                  id="address"
                  type="textarea"
                  value={editPatient.address}
                  onChange={(e) => handlePatientChange('address', e.target.value)}
                  rows={3}
                />

                <div className="border-t border-surface-200 pt-6">
                  <Text as="h3" className="text-lg font-medium text-surface-900 mb-4">Emergency Contact</Text>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="Name"
                      id="ecName"
                      type="text"
                      value={editPatient.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    />
                    <FormField
                      label="Phone"
                      id="ecPhone"
                      type="tel"
                      value={editPatient.emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    />
                    <FormField
                      label="Relationship"
                      id="ecRelationship"
                      type="text"
                      value={editPatient.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" onClick={onClose} variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Update Patient
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditPatientForm;