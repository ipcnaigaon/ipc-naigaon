# Resource Manager Role - Firebase Setup Guide

## Overview
The Resource Manager role allows users to manage articles, resources, and educational content in the church admin dashboard without having full admin privileges.

## Default Credentials

A default resource manager account has been created with the following credentials:

```
Email:    resourcemanager@christag.org
Password: ResourceManager@2025
Role:     resource_manager
```

⚠️ **IMPORTANT**: Change these credentials immediately in production!

## Permissions

Resource Managers have the following permissions:

### Accessible Modules:
- 📊 Dashboard - View statistics and overview
- 📚 Resources - Full CRUD operations
  - Create new articles/resources
  - Edit existing articles/resources
  - Delete articles/resources
  - View all resources
- 🔔 Notifications - View notifications
- ⚙️ Settings - Access user settings

### Restricted Modules:
- ❌ Members - Cannot manage members
- ❌ Events - Cannot manage events
- ❌ Donations - Cannot manage donations
- ❌ User Management - Cannot manage other users

## Firebase Database Structure

Resource Manager users are stored in Firestore under the `users` collection:

```json
{
  "uid": "user-unique-id",
  "email": "resourcemanager@christag.org",
  "name": "Resource Manager",
  "role": "resource_manager",
  "status": "active",
  "permissions": [
    "view_resources",
    "create_resource",
    "edit_resource",
    "delete_resource"
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Creating New Resource Manager Accounts

### Method 1: Using Admin UI (Recommended)

1. Log in with admin credentials
2. Navigate to `/admin/users`
3. Click "Create User" button
4. Fill in the form:
   - Email: resource-manager-email@example.com
   - Password: Strong password (min 8 characters)
   - Name: Manager's name
   - Role: Select "Resource Manager"
5. Click "Create User"
6. Share credentials with the resource manager securely

### Method 2: Manual Firebase Console

1. Go to Firebase Console → Authentication
2. Click "Create user"
3. Enter email and password
4. Note the UID
5. Go to Firestore → users collection
6. Create a new document with UID as the document ID
7. Add the following fields:
   ```
   email: (user's email)
   name: (user's name)
   role: "resource_manager"
   status: "active"
   permissions: ["view_resources", "create_resource", "edit_resource", "delete_resource"]
   createdAt: (current timestamp)
   updatedAt: (current timestamp)
   ```

## Security Rules

Firebase Security Rules have been configured to allow Resource Managers to:

✅ Read and write their own user document
✅ Read all articles
✅ Create, update, and delete articles
✅ View their own audit logs

## Workflow Example

### Resource Manager Journey:

1. **Login**
   - Navigate to `/login`
   - Enter email and password
   - Click "Login"

2. **Access Resources**
   - Click on "Resources" in sidebar (📚)
   - View all existing resources
   - Search/filter resources

3. **Create New Resource**
   - Click "Create New Resource" button
   - Fill in form:
     - Title (required)
     - Category (select from dropdown)
     - Author (required)
     - Description (required)
     - Content (required, supports markdown)
     - Image URL (optional)
   - Click "Create Resource"

4. **Edit Resource**
   - Click "Edit" button on resource card
   - Modify any field
   - Click "Update Resource"

5. **Delete Resource**
   - Click "Delete" button on resource card
   - Confirm deletion
   - Resource is removed

## Best Practices

### For Admins:
- ✅ Create separate resource manager accounts for different content managers
- ✅ Use strong, unique passwords for each account
- ✅ Monitor resource changes through activity logs
- ✅ Regularly review user access permissions
- ✅ Disable accounts when users leave the organization

### For Resource Managers:
- ✅ Keep passwords confidential
- ✅ Use descriptive titles and categories
- ✅ Add high-quality images for better engagement
- ✅ Organize content logically
- ✅ Review content before publishing

## Troubleshooting

### Issue: Cannot create resource
- **Solution**: Verify your role is set to "resource_manager"
- **Solution**: Check browser console for error messages
- **Solution**: Ensure Firebase is properly configured

### Issue: Cannot see resources
- **Solution**: Refresh the page
- **Solution**: Check internet connection
- **Solution**: Clear browser cache and cookies

### Issue: Forgot password
- **Solution**: Click "Forgot Password" on login page
- **Solution**: Enter email and follow recovery steps
- **Solution**: Contact admin if recovery email not received

## API Reference

### Creating Resource Managers Programmatically

```javascript
import { createResourceManagerUser } from '@/services/authService.firebase';

// Create a new resource manager
const newManager = await createResourceManagerUser({
  email: 'manager@example.com',
  password: 'SecurePassword123!',
  name: 'Content Manager Name'
});

console.log('Created user:', newManager.uid);
```

## Support & Updates

For issues or questions:
1. Check this documentation
2. Review Firebase console logs
3. Contact system administrator
4. Check application logs: `src/logs/`

## Version Information

- Created: December 20, 2025
- Role: resource_manager
- Version: 1.0.0
