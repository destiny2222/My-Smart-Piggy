# SmartPiggy - Backend Integration Guide

## Overview
SmartPiggy frontend is now integrated with the Laravel backend API. This document outlines the implementation and usage.

## Setup

### 1. Environment Configuration
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Start the Backend
Ensure your Laravel backend is running on `http://localhost:8000`

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

## Features Implemented

### Authentication System
- **Login**: Users can log in with email and password
- **Auto-redirect**: Authenticated users are redirected to dashboard
- **Protected Routes**: Dashboard pages require authentication
- **Token Management**: JWT tokens stored in localStorage
- **Auto Logout**: Logout functionality clears tokens and redirects to login

### API Integration

#### 1. Login Page (`/login`)
- Integrates with `/api/login` endpoint
- Displays error messages for invalid credentials
- Stores access token and user data
- Auto-redirects to dashboard on success

#### 2. Dashboard (`/dashboard`)
- Fetches user analytics from `/api/user/analytics`
- Displays total amount paid
- Protected route - requires authentication

#### 3. Payment History (`/dashboard/history`)
- Fetches payment history from `/api/user/payment-history`
- Displays all transactions in a table
- Shows payment date, status, and amount
- Calculates total payments

#### 4. Settings Page (`/dashboard/settings`)

**Profile Settings:**
- Fetches user details from `/api/user/details`
- Update name, email, phone
- Upload profile picture
- Real-time profile updates

**Security Settings:**
- Change password functionality
- Current password validation
- Password confirmation matching

## File Structure

```
app/
├── lib/
│   └── api.ts              # API client and endpoint functions
├── context/
│   └── AuthContext.tsx     # Authentication context and hooks
├── components/
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── login/
│   └── page.tsx           # Login page with API integration
├── dashboard/
│   ├── layout.tsx         # Dashboard layout with user info
│   ├── page.tsx           # Dashboard with analytics
│   ├── history/
│   │   └── page.tsx       # Payment history
│   └── settings/
│       └── page.tsx       # Profile & security settings
```

## API Endpoints Used

### Public Endpoints
- `POST /api/login` - User login

### Protected Endpoints (Require Bearer Token)
- `GET /api/user` - Get current user
- `GET /api/user/details` - Get detailed user info
- `GET /api/user/payment-history` - Get payment history
- `GET /api/user/analytics` - Get user analytics
- `PUT /api/user/edit-profile` - Update user profile
- `PUT /api/user/change-password` - Change password

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/login`
3. Backend validates and returns access token
4. Token stored in localStorage
5. All subsequent API calls include `Authorization: Bearer {token}` header
6. AuthContext manages user state globally
7. ProtectedRoute component guards dashboard pages

## Usage Examples

### Using the Auth Context
```tsx
import { useAuth } from '@/app/context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  // Access user data
  console.log(user?.name);
  
  // Login
  await login(email, password);
  
  // Logout
  logout();
}
```

### Making API Calls
```tsx
import { userApi } from '@/app/lib/api';

// Get payment history
const response = await userApi.getPaymentHistory();
console.log(response.data);

// Update profile
await userApi.editProfile({
  name: "New Name",
  email: "new@email.com"
});
```

## Security Features

1. **Token-based Authentication**: Uses Laravel Sanctum tokens
2. **Route Protection**: ProtectedRoute component prevents unauthorized access
3. **Automatic Token Verification**: Validates token on app load
4. **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

## Error Handling

All API calls include try-catch error handling:
- Display user-friendly error messages
- Network errors caught and displayed
- Validation errors from backend shown in forms

## Next Steps

### Recommended Enhancements:
1. **Token Refresh**: Implement automatic token refresh
2. **Registration**: Add user registration page
3. **Password Reset**: Implement forgot password flow
4. **Profile Pictures**: Handle image uploads properly
5. **Loading States**: Add skeleton loaders for better UX
6. **Error Boundaries**: Add React error boundaries
7. **Toast Notifications**: Use a toast library for better feedback
8. **Input Validation**: Add client-side form validation

## Troubleshooting

### Common Issues:

**CORS Errors:**
- Ensure Laravel backend has proper CORS configuration
- Check `config/cors.php` in Laravel project

**401 Unauthorized:**
- Token may have expired
- Clear localStorage and login again

**Connection Refused:**
- Ensure backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Profile Picture Not Showing:**
- Ensure images are in `public/storage` directory
- Run `php artisan storage:link` in Laravel project

## Production Deployment

Before deploying to production:

1. Update `NEXT_PUBLIC_API_URL` to production API URL
2. Implement HTTPS for secure token transmission
3. Consider using httpOnly cookies instead of localStorage
4. Add rate limiting on API endpoints
5. Implement proper error logging
6. Add API request retry logic
7. Set up proper CORS policies

## Support

For issues or questions, please refer to:
- Laravel Sanctum Documentation
- Next.js Documentation
- API Documentation (see backend README)
