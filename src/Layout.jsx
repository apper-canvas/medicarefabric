import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from './config/routes';

function Layout() {
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
const location = useLocation();
  const navigate = useNavigate();

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);

  const handleNotificationClick = (notification) => {
    // Route based on notification type
    switch (notification.type) {
      case 'admission':
      case 'lab':
        navigate('/patients');
        break;
      case 'appointment':
        navigate('/appointments');
        break;
      case 'medication':
        navigate('/patients');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <h1 className="text-xl font-bold text-surface-900">MediCare Hub</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
              />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

<div className="flex items-center space-x-3 relative">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative"
              >
                <ApperIcon name="Bell" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-surface-200 z-50"
                    >
                      <div className="p-4 border-b border-surface-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-surface-900">Notifications</h3>
                          <button 
                            onClick={() => setNotificationsOpen(false)}
                            className="text-surface-500 hover:text-surface-700 transition-colors"
                          >
                            <ApperIcon name="X" size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {[
                          {
                            id: 1,
                            title: "New Patient Admission",
                            message: "Sarah Johnson has been admitted to Ward 3A",
                            time: "5 minutes ago",
                            unread: true,
                            type: "admission"
                          },
                          {
                            id: 2,
                            title: "Lab Results Ready",
                            message: "Blood work results available for Patient #12458",
                            time: "15 minutes ago",
                            unread: true,
                            type: "lab"
                          },
                          {
                            id: 3,
                            title: "Appointment Reminder",
                            message: "Dr. Smith consultation at 2:30 PM",
                            time: "1 hour ago",
                            unread: false,
                            type: "appointment"
                          },
                          {
                            id: 4,
                            title: "Medication Alert",
                            message: "Patient medication review due today",
                            time: "2 hours ago",
                            unread: false,
                            type: "medication"
                          }
].map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-surface-50 hover:bg-surface-25 transition-colors cursor-pointer ${
                              notification.unread ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                notification.type === 'admission' ? 'bg-green-100 text-green-600' :
                                notification.type === 'lab' ? 'bg-blue-100 text-blue-600' :
                                notification.type === 'appointment' ? 'bg-orange-100 text-orange-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                <ApperIcon 
                                  name={
                                    notification.type === 'admission' ? 'UserPlus' :
                                    notification.type === 'lab' ? 'FlaskConical' :
                                    notification.type === 'appointment' ? 'Calendar' :
                                    'Pill'
                                  } 
                                  size={16} 
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-surface-900 truncate">
                                    {notification.title}
                                  </h4>
                                  {notification.unread && (
                                    <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                                  )}
                                </div>
                                <p className="text-sm text-surface-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-surface-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-surface-100">
                        <button className="w-full text-center text-sm text-primary hover:text-primary-dark transition-colors font-medium">
                          Mark all as read
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-surface-50 border-r border-surface-200 z-40">
          <nav className="h-full overflow-y-auto p-4">
            <div className="space-y-2">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white border-l-4 border-accent'
                        : 'text-surface-700 hover:bg-surface-100 hover:-translate-y-0.5'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span className="font-medium">{route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={{ duration: 0.3 }}
                className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-surface-50 border-r border-surface-200 z-50"
              >
                <nav className="h-full overflow-y-auto p-4">
                  <div className="space-y-2">
                    {visibleRoutes.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white border-l-4 border-accent'
                              : 'text-surface-700 hover:bg-surface-100'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Layout;