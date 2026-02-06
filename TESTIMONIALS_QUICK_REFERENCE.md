# Testimonials Quick Reference

## Files Location
```
src/
├── services/
│   └── testimonialService.firebase.js      # Firebase service
├── components/
│   └── testimonials/
│       ├── TestimonialForm.js              # Create/Edit form
│       ├── TestimonialForm.css
│       ├── TestimonialsManagement.js       # Admin management page
│       └── TestimonialsManagement.css
└── App.js                                   # Routes added
```

## Admin Routes
- `/admin/testimonials` - View all testimonials
- `/admin/testimonials/new` - Create new testimonial
- `/admin/testimonials/:id` - Edit specific testimonial

## Firebase Collection
**Collection:** `testimonials`

**Document Structure:**
```json
{
  "name": "Br Leji",
  "role": "Member since 2018",
  "content": "This church has been a blessing...",
  "createdAt": "2025-12-26T10:30:00.000Z",
  "updatedAt": "2025-12-26T10:30:00.000Z"
}
```

## Service Functions

### Get All Testimonials
```javascript
import { getAllTestimonials } from '../../services/testimonialService.firebase';

const testimonials = await getAllTestimonials();
```

### Get Single Testimonial
```javascript
const testimonial = await getTestimonialById('testimonial-id');
```

### Create Testimonial
```javascript
const newTestimonial = await createTestimonial({
  name: 'John Doe',
  role: 'Member',
  content: 'Great experience at church...'
});
```

### Update Testimonial
```javascript
await updateTestimonial('testimonial-id', {
  name: 'Jane Doe',
  role: 'Youth Ministry Lead',
  content: 'Updated testimonial content'
});
```

### Delete Testimonial
```javascript
await deleteTestimonial('testimonial-id');
```

## Home Page Integration
- Testimonials automatically load on page mount
- Displays all available testimonials from Firebase
- Shows mock testimonials as fallback if Firebase fails
- No admin interaction required on home page

## Admin Panel Features
| Feature | Description |
|---------|-------------|
| View All | Table view of all testimonials |
| Create | Form to create new testimonial |
| Edit | Form to modify existing testimonial |
| Delete | Remove testimonial with confirmation |
| Search | Filter testimonials by name/role/content |
| Status | Shows loading/error states |

## Form Validation Rules
- **Name:** Required, max 100 characters
- **Role:** Required, max 100 characters
- **Content:** Required, min 20, max 500 characters

## Firestore Rules
Ensure proper Firestore security rules are set up:
```
allow create, read, update, delete: if request.auth != null && 
  request.auth.token.role in ['admin', 'content_manager'];
```

## Responsive Behavior
- Desktop: Full table view with all columns
- Tablet: Adjusted column widths, compact layout
- Mobile: Horizontal scroll on table, stacked buttons

## Error Handling
- API failures fall back to mock data (home page only)
- Form validation prevents invalid submissions
- Network errors display user-friendly messages
- Delete operations require user confirmation

## Performance Notes
- Testimonials sorted by creation date (newest first)
- Firebase queries include `orderBy('createdAt', 'desc')`
- Mock data only used as fallback, not in production
- All timestamps use server-side Firebase timestamps
