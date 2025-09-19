import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Sidebar({ navItems, title }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      background: '#f4f4f4',
      padding: '20px',
      borderRight: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2>{title}</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map(item => (
            <li key={item.name} style={{ margin: '10px 0' }}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <button 
        onClick={handleLogout} 
        style={{ marginTop: 'auto', padding: '10px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}
