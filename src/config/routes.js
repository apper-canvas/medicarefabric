import HomePage from '@/components/pages/HomePage';
import PatientsPage from '@/components/pages/PatientsPage';
import PatientDetailPage from '@/components/pages/PatientDetailPage';
import AppointmentsPage from '@/components/pages/AppointmentsPage';
import DepartmentsPage from '@/components/pages/DepartmentsPage';
import BedsPage from '@/components/pages/BedsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
component: HomePage
  },
  patients: {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: 'Users',
component: PatientsPage
  },
  patientDetail: {
    id: 'patientDetail',
    label: 'Patient Detail',
    path: '/patients/:id',
    icon: 'User',
component: PatientDetailPage,
    hidden: true
  },
  appointments: {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: 'Calendar',
component: AppointmentsPage
  },
  departments: {
    id: 'departments',
    label: 'Departments',
    path: '/departments',
    icon: 'Building2',
component: DepartmentsPage
  },
  beds: {
    id: 'beds',
    label: 'Beds',
    path: '/beds',
    icon: 'Bed',
component: BedsPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
component: ReportsPage
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
component: NotFoundPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);