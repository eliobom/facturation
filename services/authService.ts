import { User } from '@/context/AuthContext';

// Mock database - in a real app, this would be a backend service
const users = [
  {
    id: '1',
    name: 'John Coach',
    email: 'coach@example.com',
    password: 'password123',
    role: 'coach' as const,
  },
  {
    id: '2',
    name: 'Sam Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student' as const,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await delay(1000);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  // For demo purposes, create a new user if not found
  if (email && password) {
    const newUser = {
      id: `${users.length + 1}`,
      name: email.split('@')[0],
      email,
      role: 'student' as const,
    };
    
    users.push({ ...newUser, password });
    return newUser;
  }
  
  throw new Error('Invalid credentials');
};

export const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  role: 'student' | 'coach'
): Promise<User> => {
  // Simulate API call
  await delay(1000);
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser = {
    id: `${users.length + 1}`,
    name,
    email,
    role,
  };
  
  users.push({ ...newUser, password });
  
  return newUser;
};

export const fetchUserData = async (userId: string): Promise<User | null> => {
  // Simulate API call
  await delay(500);
  
  const user = users.find(u => u.id === userId);
  
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
};