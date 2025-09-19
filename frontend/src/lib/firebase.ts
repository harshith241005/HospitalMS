import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-6802964534-469e7",
  "appId": "1:952313370289:web:dbc34615b4b84c01677490",
  "storageBucket": "studio-6802964534-469e7.firebasestorage.app",
  "apiKey": "AIzaSyBt8vfLtWjn3ytuCHTvyWoX-2HVZuaiQas",
  "authDomain": "studio-6802964534-469e7.firebaseapp.com",
  "messagingSenderId": "952313370289"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
