
-- Placement Prep MySQL Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS placement_prep;
USE placement_prep;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- In production, ensure this is properly hashed
  name VARCHAR(255),
  is_new_user BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  year VARCHAR(50),
  branch VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User languages preference table
CREATE TABLE IF NOT EXISTS user_languages (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  language_id VARCHAR(50) NOT NULL, -- e.g., 'java', 'python', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  language_id VARCHAR(50) NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Completed courses table
CREATE TABLE IF NOT EXISTS completed_courses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Performance history table
CREATE TABLE IF NOT EXISTS performance_history (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('contest', 'interview', 'practice') NOT NULL,
  language_id VARCHAR(50) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL,
  time_taken INT NOT NULL, -- in seconds
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  platform_name VARCHAR(100),
  title VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data (optional)
INSERT INTO users (id, email, password, name, is_new_user)
VALUES 
  ('user-1', 'demo@example.com', 'password123', 'Demo User', FALSE);

INSERT INTO user_preferences (id, user_id, year, branch)
VALUES 
  ('pref-1', 'user-1', '3', 'cs');

INSERT INTO user_languages (id, user_id, language_id)
VALUES 
  ('lang-1', 'user-1', 'java'),
  ('lang-2', 'user-1', 'python');

INSERT INTO user_progress (id, user_id, language_id, progress)
VALUES 
  ('prog-1', 'user-1', 'java', 45.5),
  ('prog-2', 'user-1', 'python', 30.0);

INSERT INTO completed_courses (id, user_id, item_id)
VALUES 
  ('comp-1', 'user-1', 'java-basics-1'),
  ('comp-2', 'user-1', 'java-basics-2');

INSERT INTO performance_history (id, user_id, type, language_id, score, max_score, time_taken, platform_name, title)
VALUES 
  ('perf-1', 'user-1', 'practice', 'java', 85, 100, 1800, 'LeetCode', 'Java Arrays Practice'),
  ('perf-2', 'user-1', 'contest', 'python', 70, 100, 3600, 'HackerRank', 'Weekly Python Challenge');

-- Add indexes for better performance
CREATE INDEX idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_completed_courses_user_id ON completed_courses(user_id);
CREATE INDEX idx_performance_history_user_id ON performance_history(user_id);
CREATE INDEX idx_performance_history_language ON performance_history(language_id);
CREATE INDEX idx_performance_history_type ON performance_history(type);
