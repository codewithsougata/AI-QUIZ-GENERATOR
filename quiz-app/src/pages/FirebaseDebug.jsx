// FirebaseDebug.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';

export default function FirebaseDebug() {
  const { currentUser } = useAuth();
  
  // Safe debug component
  return null;
}