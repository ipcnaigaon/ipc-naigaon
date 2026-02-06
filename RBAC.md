# Role-Based Access Control (RBAC)

## Overview
The application now supports role-based access control with four distinct roles:

## Roles and Permissions

### 1. Admin
- **Full system access**
- Can manage all modules:
  - Dashboard
  - Members
  - Events
  - Donations
  - User Management (assign roles)
  - Notifications
  - Settings

### 2. Events Manager
- **Event-focused access**
- Can access:
  - Dashboard
  - Events (full CRUD)
  - Notifications
  - Settings

### 3. Finance Manager
- **Finance-focused access**
- Can access:
  - Dashboard
  - Donations (full CRUD)
  - Notifications
  - Settings

### 4. User
- **Basic access**
- Limited or no admin portal access
- Can be assigned for future member portal roles

## Managing User Roles

### For Admins:
1. Navigate to **User Management** from the sidebar
2. Search for the user you want to modify
3. Click **Change Role** button
4. Select the desired role from the dropdown
5. Role changes take effect immediately

## Implementation Details

### Menu Visibility
- Sidebar menu items are filtered based on user role
- Users only see menu items they have permission to access

### Route Protection
- Routes are protected using the `RoleGuard` component
- Unauthorized access attempts show "Access Denied" message
- Users are automatically redirected if they try to access restricted pages

### Default Role
- New users are assigned the "user" role by default
- Only admins can change user roles

## Testing Roles

To test different roles:
1. Login as admin (admin@christag.com)
2. Go to User Management
3. Change a user's role
4. Logout and login as that user to see role-specific access

## Security Notes
- Role information is stored in Firestore
- Role changes are tracked with timestamps
- Frontend and backend validation ensure role enforcement
- Token includes role information for API authentication
