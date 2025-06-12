import Home from '../pages/Home';
import Patients from '../pages/Patients';
import PatientDetail from '../pages/PatientDetail';
import Appointments from '../pages/Appointments';
import Departments from '../pages/Departments';
import Beds from '../pages/Beds';
import Reports from '../pages/Reports';
import NotFound from '../pages/NotFound';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Home
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
    component: Patients
  },
  patientDetail: {
    id: 'patientDetail',
    label: 'Patient Detail',
    path: '/patients/:id',
    icon: 'User',
    component: PatientDetail,
    hidden: true
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
    component: Appointments
  },
  departments: {
    id: 'departments',
    label: 'Departments',
    path: '/departments',
    icon: 'Building2',
    component: Departments
  },
  beds: {
    id: 'beds',
    label: 'Beds',
    path: '/beds',
    icon: 'Bed',
    component: Beds
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFound,
    hidden: true
  }
};

export const routeArray = Object.values(routes);