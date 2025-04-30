import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios"; // Assuming you're using axios for API requests

// Define the User interface
interface User {
  _id: string;
  name: string;
  username: string;
  email?: string; // Add email property
  bio?: string;
  profileImage?: string;
  isVerified?: boolean;
  bannerImage?: string;
  lastActive?: string;
}

// Define the context type
interface AuthUserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  refreshUserData: () => Promise<void>; // Function to refresh user data
}

// Define props for the provider
interface AuthUserProviderProps {
  children: ReactNode;
}

// Create context
export const AuthUserContext = createContext<AuthUserContextType | undefined>(
  undefined
);

// Provider component
export const AuthUserProvider: React.FC<AuthUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    // If no token is available, skip fetching and mark as not loading
    if (!token) {
      setLoading(false);
      setUser(null); // Ensure user state is cleared
      return;
    }

    try {
      const response = await axios.get("http://localhost:5001/api/users/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      // Normalize the lastActive date if available
      if (userData.lastActive && userData.lastActive.$date) {
        userData.lastActive = new Date(userData.lastActive.$date).toISOString();
      }

      setUser(userData); // Update user state
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Clear user state in case of an error
      setUser(null);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  // Function to refresh user data manually
  const refreshUserData = async () => {
    setLoading(true); // Mark as loading
    await fetchUserData(); // Refetch user data
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthUserContext.Provider
      value={{ user, setUser, loading, refreshUserData }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
