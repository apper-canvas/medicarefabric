import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from './config/routes';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);

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

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-lg hover:bg-surface-100 transition-colors relative">
              <ApperIcon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
            </button>
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