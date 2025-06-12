import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/atoms/Card';

const initialNewPatientState = {
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
};

const AddPatientForm = ({ isOpen, onClose, onSubmit }) => {
  const [newPatient, setNewPatient] = useState(initialNewPatientState);

  const departments = ['Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'ICU'];
  const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(newPatient);
    setNewPatient(initialNewPatientState); // Reset form after submission
  };

  const handlePatientChange = (field, value) => {
    setNewPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setNewPatient(prev => ({
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
                  <Text as="h2" className="text-xl font-semibold text-surface-900">Register New Patient</Text>
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
                    value={newPatient.firstName}
                    onChange={(e) => handlePatientChange('firstName', e.target.value)}
                    required
                  />
                  <FormField
                    label="Last Name"
                    id="lastName"
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => handlePatientChange('lastName', e.target.value)}
                    required
                  />
                  <FormField
                    label="Date of Birth"
                    id="dateOfBirth"
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => handlePatientChange('dateOfBirth', e.target.value)}
                    required
                  />
                  <FormField
                    label="Gender"
                    id="gender"
                    type="select"
                    value={newPatient.gender}
                    onChange={(e) => handlePatientChange('gender', e.target.value)}
                    options={genders}
                    placeholder="Select Gender"
                    required
                  />
                  <FormField
                    label="Phone"
                    id="phone"
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) => handlePatientChange('phone', e.target.value)}
                    required
                  />
                  <FormField
                    label="Email"
                    id="email"
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => handlePatientChange('email', e.target.value)}
                  />
                  <FormField
                    label="Department"
                    id="department"
                    type="select"
                    value={newPatient.department}
                    onChange={(e) => handlePatientChange('department', e.target.value)}
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                    placeholder="Select Department"
                    required
                  />
                  <FormField
                    label="Assigned Doctor"
                    id="assignedDoctor"
                    type="text"
                    value={newPatient.assignedDoctor}
                    onChange={(e) => handlePatientChange('assignedDoctor', e.target.value)}
                    required
                  />
                </div>

                <FormField
                  label="Address"
                  id="address"
                  type="textarea"
                  value={newPatient.address}
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
                      value={newPatient.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                    />
                    <FormField
                      label="Phone"
                      id="ecPhone"
                      type="tel"
                      value={newPatient.emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    />
                    <FormField
                      label="Relationship"
                      id="ecRelationship"
                      type="text"
                      value={newPatient.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" onClick={onClose} variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Register Patient
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

export default AddPatientForm;