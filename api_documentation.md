# API Documentation - OTP Password Reset

This guide provides the necessary details to integrate the OTP password reset flow into your frontend application.

## Base URL
`{{env('APP_URL')}}/api` (e.g., `http://localhost:8000/api`)

---

## 1. Request OTP
Initiates the password reset process by sending an OTP to the user's email.

- **Endpoint**: `/forgot-password`
- **Method**: `POST`
- **Payload**:
```json
{
  "email": "user@example.com"
}
```
- **Success Response (200 OK)**:
```json
{
  "message": "OTP sent successfully to your email."
}
```
- **Success Response (200 OK - Email not found)**:
  *Note: For security reasons, the API returns a generic message even if the email doesn't exist.*
```json
{
  "message": "If an account exists with this email, an OTP has been sent."
}
```

---

## 2. Verify OTP
Checks if the entered OTP is valid before proceeding to the reset step. (Optional but recommended for a better UX).

- **Endpoint**: `/verify-otp`
- **Method**: `POST`
- **Payload**:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```
- **Success Response (200 OK)**:
```json
{
  "message": "OTP verified successfully."
}
```
- **Error Response (422 Unprocessable Entity)**:
```json
{
  "message": "Invalid or expired OTP."
}
```

---

## 3. Reset Password
The final step to update the user's password using the OTP.

- **Endpoint**: `/reset-password`
- **Method**: `POST`
- **Payload**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```
- **Success Response (200 OK)**:
```json
{
  "message": "Password reset successful."
}
```
- **Error Response (422 Unprocessable Entity - Invalid OTP)**:
```json
{
  "message": "Invalid or expired OTP."
}
```
- **Error Response (422 Unprocessable Entity - Validation Error)**:
```json
{
  "message": "The password matching confirmation does not match.",
  "errors": {
    "password": ["The password confirmation does not match."]
  }
}
```
