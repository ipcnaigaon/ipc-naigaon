/**
 * Role Configuration
 * Defines available roles and their permissions in the system
 */

export const ROLES = {
  ADMIN: 'admin',
  EVENTS_MANAGER: 'events_manager',
  FINANCE_MANAGER: 'finance_manager',
  RESOURCE_MANAGER: 'resource_manager',
};

/**
 * Role Permissions Matrix
 * Defines what each role can access in the application
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    name: 'Administrator',
    description: 'Full access to all features',
    modules: [
      'dashboard',
      'members',
      'events',
      'donations',
      'resources',
      'notifications',
      'user_management',
      'settings',
    ],
    canManage: ['all'],
  },
  [ROLES.EVENTS_MANAGER]: {
    name: 'Events Manager',
    description: 'Manage events and view dashboard',
    modules: ['dashboard', 'events', 'notifications', 'settings'],
    canManage: ['events'],
  },
  [ROLES.FINANCE_MANAGER]: {
    name: 'Finance Manager',
    description: 'Manage donations and financial reports',
    modules: ['dashboard', 'donations', 'notifications', 'settings'],
    canManage: ['donations'],
  },
  [ROLES.RESOURCE_MANAGER]: {
    name: 'Resource Manager',
    description: 'Manage articles, resources, and educational content',
    modules: ['dashboard', 'resources', 'notifications', 'settings'],
    canManage: ['resources'],
  },
};

/**
 * Get all available roles
 */
export const getAllRoles = () => {
  return Object.values(ROLES);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
  return ROLE_PERMISSIONS[role]?.name || role;
};

/**
 * Get role description
 */
export const getRoleDescription = (role) => {
  return ROLE_PERMISSIONS[role]?.description || '';
};

/**
 * Check if role has access to module
 */
export const hasModuleAccess = (role, module) => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.modules.includes('all')) return true;
  return permissions.modules.includes(module);
};

/**
 * Get modules accessible by role
 */
export const getAccessibleModules = (role) => {
  return ROLE_PERMISSIONS[role]?.modules || [];
};

/**
 * Get all role options for dropdowns
 */
export const getRoleOptions = () => {
  return Object.entries(ROLE_PERMISSIONS).map(([key, value]) => ({
    value: key,
    label: value.name,
    description: value.description,
  }));
};

export default {
  ROLES,
  ROLE_PERMISSIONS,
  getAllRoles,
  getRoleDisplayName,
  getRoleDescription,
  hasModuleAccess,
  getAccessibleModules,
  getRoleOptions,
};
