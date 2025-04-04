
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Define user interface
export interface UserPreferences {
  year?: string;
  branch?: string;
  languages: string[];
}

export interface PerformanceData {
  id: string;
  type: "contest" | "interview" | "practice";
  language: string;
  score: number;
  maxScore: number;
  timeTaken: number; // in seconds
  date: string;
  platformName: string;
  title: string;
}

export interface UserData {
  id: string;
  email: string;
  name?: string;
  isNewUser: boolean;
  preferences?: UserPreferences;
  progress: Record<string, number>;
  completedCourses: string[];
  performanceHistory: PerformanceData[];
}

interface UserContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;
  updateProgress: (languageId: string, progress: number) => void;
  completeItem: (itemId: string) => void;
  recordPerformance: (performance: Omit<PerformanceData, "id" | "date">) => void;
  getPerformanceStats: (type?: string, language?: string) => {
    averageScore: number;
    totalAttempts: number;
    bestScore: number;
    averageTime: number;
  };
  getAllPerformance: (type?: string, language?: string) => PerformanceData[];
}

// Initialize the database
const initializeDatabase = () => {
  // Check if the database is already initialized
  if (!localStorage.getItem("placement_prep_db_initialized")) {
    console.log("Initializing database...");
    
    // Create tables if they don't exist
    if (!localStorage.getItem("placement_prep_users")) {
      localStorage.setItem("placement_prep_users", JSON.stringify([]));
    }
    
    localStorage.setItem("placement_prep_db_initialized", "true");
    console.log("Database initialized successfully");
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database on first load
  useEffect(() => {
    initializeDatabase();
  }, []);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("placement_prep_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("placement_prep_user", JSON.stringify(user));
    }
  }, [user]);

  // Function to simulate storing data in MySQL database
  const storeUserInDatabase = async (userData: any) => {
    try {
      // In a real application, this would be an API call to your backend
      console.log("Storing user in MySQL database:", userData);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This is where you would normally make a fetch or axios request
      // to your backend API to store the user in MySQL
      
      // Example:
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });
      // if (!response.ok) throw new Error('Failed to store user');
      
      return true;
    } catch (error) {
      console.error("Error storing user in database:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll check if the user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("placement_prep_users") || "[]");
      const foundUser = existingUsers.find((u: any) => u.email === email);
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error("Invalid credentials");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userWithoutPassword.name || "user"}!`,
      });
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, store user in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("placement_prep_users") || "[]");
      
      // Check if user already exists
      if (existingUsers.some((u: any) => u.email === email)) {
        throw new Error("User with this email already exists");
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        name,
        isNewUser: true,
        progress: {},
        completedCourses: [],
        performanceHistory: []
      };
      
      // Save to "database"
      existingUsers.push(newUser);
      localStorage.setItem("placement_prep_users", JSON.stringify(existingUsers));
      
      // Store user in MySQL database
      await storeUserInDatabase({
        id: newUser.id,
        email: newUser.email,
        password: newUser.password, // In production, this should be hashed
        name: newUser.name,
        is_new_user: newUser.isNewUser,
      });
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("placement_prep_user");
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = async (data: Partial<UserData>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    // Update in "database" too
    const existingUsers = JSON.parse(localStorage.getItem("placement_prep_users") || "[]");
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === user.id ? { ...u, ...data } : u
    );
    
    localStorage.setItem("placement_prep_users", JSON.stringify(updatedUsers));
    
    // Store updated preferences in MySQL database if preferences were updated
    if (data.preferences) {
      try {
        await storeUserInDatabase({
          user_id: user.id,
          year: data.preferences.year,
          branch: data.preferences.branch,
          languages: data.preferences.languages,
          // This would update the user_preferences and user_languages tables
        });
      } catch (error) {
        console.error("Error updating user preferences in database:", error);
      }
    }
  };

  const updateProgress = async (languageId: string, progress: number) => {
    if (!user) return;
    
    const updatedProgress = { ...user.progress, [languageId]: progress };
    updateUser({ progress: updatedProgress });
    
    // Store progress update in MySQL database
    try {
      await storeUserInDatabase({
        user_id: user.id,
        language_id: languageId,
        progress: progress,
        // This would update the user_progress table
      });
    } catch (error) {
      console.error("Error updating progress in database:", error);
    }
  };

  const completeItem = async (itemId: string) => {
    if (!user) return;
    
    if (!user.completedCourses.includes(itemId)) {
      const updatedCompleted = [...user.completedCourses, itemId];
      updateUser({ completedCourses: updatedCompleted });
      
      // Store completed course in MySQL database
      try {
        await storeUserInDatabase({
          user_id: user.id,
          item_id: itemId,
          // This would insert into the completed_courses table
        });
      } catch (error) {
        console.error("Error storing completed course in database:", error);
      }
    }
  };

  const recordPerformance = async (performance: Omit<PerformanceData, "id" | "date">) => {
    if (!user) return;
    
    const newPerformance: PerformanceData = {
      ...performance,
      id: `perf-${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    const updatedPerformanceHistory = [...(user.performanceHistory || []), newPerformance];
    updateUser({ performanceHistory: updatedPerformanceHistory });
    
    // Store performance in MySQL database
    try {
      await storeUserInDatabase({
        id: newPerformance.id,
        user_id: user.id,
        type: newPerformance.type,
        language_id: newPerformance.language,
        score: newPerformance.score,
        max_score: newPerformance.maxScore,
        time_taken: newPerformance.timeTaken,
        platform_name: newPerformance.platformName,
        title: newPerformance.title,
        // This would insert into the performance_history table
      });
    } catch (error) {
      console.error("Error storing performance in database:", error);
    }
    
    toast({
      title: "Performance Recorded",
      description: `Your ${performance.type} performance has been saved.`,
    });
    
    return newPerformance;
  };

  const getPerformanceStats = (type?: string, language?: string) => {
    if (!user || !user.performanceHistory) {
      return {
        averageScore: 0,
        totalAttempts: 0,
        bestScore: 0,
        averageTime: 0,
      };
    }
    
    let filteredPerformance = [...user.performanceHistory];
    
    if (type) {
      filteredPerformance = filteredPerformance.filter(p => p.type === type);
    }
    
    if (language) {
      filteredPerformance = filteredPerformance.filter(p => p.language === language);
    }
    
    if (filteredPerformance.length === 0) {
      return {
        averageScore: 0,
        totalAttempts: 0,
        bestScore: 0,
        averageTime: 0,
      };
    }
    
    const totalScore = filteredPerformance.reduce((sum, curr) => sum + (curr.score / curr.maxScore * 100), 0);
    const bestScoreRecord = filteredPerformance.reduce((best, curr) => 
      (curr.score / curr.maxScore) > (best.score / best.maxScore) ? curr : best, 
      filteredPerformance[0]
    );
    const totalTime = filteredPerformance.reduce((sum, curr) => sum + curr.timeTaken, 0);
    
    return {
      averageScore: totalScore / filteredPerformance.length,
      totalAttempts: filteredPerformance.length,
      bestScore: (bestScoreRecord.score / bestScoreRecord.maxScore) * 100,
      averageTime: totalTime / filteredPerformance.length,
    };
  };

  const getAllPerformance = (type?: string, language?: string) => {
    if (!user || !user.performanceHistory) {
      return [];
    }
    
    let filteredPerformance = [...user.performanceHistory];
    
    if (type) {
      filteredPerformance = filteredPerformance.filter(p => p.type === type);
    }
    
    if (language) {
      filteredPerformance = filteredPerformance.filter(p => p.language === language);
    }
    
    return filteredPerformance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      updateProgress,
      completeItem,
      recordPerformance,
      getPerformanceStats,
      getAllPerformance
    }}>
      {children}
    </UserContext.Provider>
  );
};
