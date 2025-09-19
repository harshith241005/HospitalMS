# TODO: Fix Errors in Frontend and Backend Code

## Information Gathered
- Backend Authentication Inconsistency: `authController.js` generates JWT tokens, but `authMiddleware.js` verifies Firebase ID tokens. This causes "Invalid token" errors when using JWT.
- Frontend Authentication: `login-form.tsx` uses Firebase Auth for login, not calling backend `/login` API, leading to inconsistent auth flow.
- Error Handling: Basic error handling exists, but lacks specific messages like "User not found" in authController, and no global error handler for 500 errors.
- Potential 404 Errors: Need to verify all API endpoints are correctly defined and accessible.
- Database Connection: Need to check `db.js` for connection error handling.

## Plan
- Standardize Authentication to JWT:
  - Update `authMiddleware.js` to verify JWT tokens instead of Firebase tokens.
  - Update `login-form.tsx` to call backend API login and use JWT tokens.
- Improve Error Handling:
  - Update `authController.js` to return specific error messages (e.g., "User not found").
  - Add global error handler in `server.js` for unhandled 500 errors.
  - Add try-catch blocks and proper error responses in all controllers.
- Verify Endpoints: Check routes for missing or incorrect endpoints causing 404 errors.
- Database Error Handling: Ensure `db.js` handles connection failures gracefully.

## Dependent Files to be Edited
- `backend/middleware/authMiddleware.js`: Change to JWT verification.
- `frontend/backend/src/components/auth/login-form.tsx`: Update to use backend API.
- `backend/controllers/authController.js`: Improve error messages.
- `backend/server.js`: Add global error handler.
- `backend/config/db.js`: Add connection error handling.

## Changes Made
- Updated `authMiddleware.js` to verify JWT tokens instead of Firebase.
- Updated `login-form.tsx` to call backend `/login` API and handle JWT tokens.
- Improved error messages in `authController.js` (e.g., "User not found").
- Added global error handler in `server.js` for 404 and 500 errors.
- Added export default to `db.js`.
- Created separate `loginController.js` for login logic.
- Updated `authRoutes.js` to use login from loginController.
- Added detailed error logging to `api.test.js`.
- Created `.env` file with MongoDB URI (needs manual correction for special characters).

## Followup Steps
- Manually update `.env` file with correct MongoDB URI: `mongodb+srv://hms:harshith%40%23123@cluster0.wgvvxa1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
- Restart backend server after updating `.env`.
- Test login and registration functionality.
- Run API tests to ensure no 404 or 500 errors.
- Verify database connection and handle failures.
- Update frontend to handle JWT tokens properly.
