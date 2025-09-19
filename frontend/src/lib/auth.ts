import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  isAuthenticated: boolean;
  firebaseUid?: string;
}

// Firebase Google Sign In
export const signInWithGoogle = async (): Promise<AuthUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Special handling for admin email
    if (user.email === 'harshithboyina@gmail.com') {
      // Admin login via Google - check backend
      const backendUser = await checkUserInBackend(user.email);
      
      if (backendUser) {
        const authUser: AuthUser = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role,
          isAuthenticated: true,
          firebaseUid: user.uid
        };
        
        localStorage.setItem('user', JSON.stringify(authUser));
        localStorage.setItem('firebaseUid', user.uid);
        
        return authUser;
      }
    }
    
    // Check if user exists in your backend
    const backendUser = await checkUserInBackend(user.email!);
    
    if (backendUser) {
      // User exists in backend, return their data
      const authUser: AuthUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role,
        isAuthenticated: true,
        firebaseUid: user.uid
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('firebaseUid', user.uid);
      
      return authUser;
    } else {
      // New user - register as patient by default (not for admin)
      if (user.email === 'harshithboyina@gmail.com') {
        throw new Error('Admin account not found in database. Please contact support.');
      }
      
      const newUser = await registerUserInBackend({
        name: user.displayName || 'Google User',
        email: user.email!,
        role: 'patient',
        firebaseUid: user.uid
      });
      
      const authUser: AuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isAuthenticated: true,
        firebaseUid: user.uid
      };
      
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('firebaseUid', user.uid);
      
      return authUser;
    }
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Firebase Email/Password Sign In
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Get user data from backend
    const backendUser = await checkUserInBackend(user.email!);
    
    if (backendUser) {
      const authUser: AuthUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role,
        isAuthenticated: true,
        firebaseUid: user.uid
      };
      
      localStorage.setItem('user', JSON.stringify(authUser));
      localStorage.setItem('firebaseUid', user.uid);
      
      return authUser;
    }
    
    return null;
  } catch (error) {
    console.error('Email sign in error:', error);
    throw error;
  }
};

// Firebase Email/Password Registration
export const registerWithEmail = async (
  email: string, 
  password: string, 
  userData: { name: string; role: 'patient' | 'doctor' | 'admin'; age?: number; specialization?: string }
): Promise<AuthUser | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Register user in backend
    const newUser = await registerUserInBackend({
      ...userData,
      email: user.email!,
      firebaseUid: user.uid
    });
    
    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isAuthenticated: true,
      firebaseUid: user.uid
    };
    
    localStorage.setItem('user', JSON.stringify(authUser));
    localStorage.setItem('firebaseUid', user.uid);
    
    return authUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem('user');
    localStorage.removeItem('firebaseUid');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // Check if we have user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const authUser = JSON.parse(storedUser) as AuthUser;
        callback(authUser);
      } else {
        // Fetch user data from backend
        const backendUser = await checkUserInBackend(firebaseUser.email!);
        if (backendUser) {
          const authUser: AuthUser = {
            id: backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            role: backendUser.role,
            isAuthenticated: true,
            firebaseUid: firebaseUser.uid
          };
          localStorage.setItem('user', JSON.stringify(authUser));
          callback(authUser);
        } else {
          callback(null);
        }
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('firebaseUid');
      callback(null);
    }
  });
};

// Backend API calls
const checkUserInBackend = async (email: string) => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/check-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Check user error:', error);
    return null;
  }
};

const registerUserInBackend = async (userData: any) => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/register-firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Registration failed');
  } catch (error) {
    console.error('Register user error:', error);
    throw error;
  }
};

// Get current user from localStorage
export const getCurrentUser = (): AuthUser | null => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};
