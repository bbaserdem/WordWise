# Test User Account

This document contains the test user credentials used for development and testing of the WordWise application.

## Test User Credentials

| Field | Value |
| --- | --- |
| Full Name | Batu Han |
| Email Address | test@test.com |
| Institution | Test University |
| Field of Study | Physics |
| Academic Level | PhD |
| Password | 1234aoeu"<>P |

## Usage Notes

- This account is used for testing the authentication flow
- The password includes special characters to test password validation
- The account should be created in the Firebase emulator environment
- Use this account for testing all authentication-related features

## Test Scenarios

1. **Registration Flow**: Create new account with these credentials
2. **Login Flow**: Sign in with existing credentials
3. **Profile Management**: Update profile information
4. **Password Reset**: Test password reset functionality
5. **Logout**: Test logout and session management

## Environment

- **Development**: Firebase emulators (localhost:9099 for auth, localhost:8080 for firestore)
- **Production**: Firebase production project (when deployed)

## Troubleshooting

If authentication issues occur:
1. Check Firebase emulator logs
2. Verify user exists in Firestore users collection
3. Check authentication context state
4. Review browser console for errors
5. Ensure proper environment variables are set 