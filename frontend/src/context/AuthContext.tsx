import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define an interface for the user object
interface User {
  name: string;
  username: string;
  profileImage?: string;
  bio?: string;
  bannerImage?: string; // Add bannerImage field
}



// Define a type for the context state
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, name: string, username: string, profileImage?: string, bio?: string) => void; // Add bio as optional
  logout: () => void;
  deleteUserAccount: () => Promise<void>;
  loading: boolean;
}


// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);  // Track if loading state

// Load user and authentication state from localStorage
useEffect(() => {
  const token = localStorage.getItem('token');
  const savedName = localStorage.getItem('name');
  const savedUsername = localStorage.getItem('username');
  const profileImage = localStorage.getItem('profileImage');
  const bio = localStorage.getItem('bio'); // Retrieve bio from localStorage

  if (token && savedUsername && savedName) {
    setIsAuthenticated(true);
    setUser({
      name: savedName,
      username: savedUsername,
      profileImage: profileImage || undefined,
      bio: bio || undefined, // Set bio if it exists
    });
  }
  setLoading(false); // Set loading to false after attempting to restore state
}, []);

// Function to log in the user and store bio in local storage
const login = (token: string, name: string, username: string, profileImage?: string, bio?: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('name', name);
  localStorage.setItem('username', username);
  if (profileImage) localStorage.setItem('profileImage', profileImage);
  if (bio) localStorage.setItem('bio', bio);  // Store bio in localStorage

  setIsAuthenticated(true);
  setUser({ name, username, profileImage, bio });
};



  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    localStorage.removeItem('profileImage');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, deleteUserAccount: async () => {}, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
