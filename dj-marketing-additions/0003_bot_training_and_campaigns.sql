-- Migration: Add content bot training + enhanced competitor research tables
-- Run with: webdev_execute_sql

-- Bot training examples - posts the user likes as reference
CREATE TABLE IF NOT EXISTS bot_training_examples (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  audience ENUM('wedding', 'course', 'brand') NOT NULL DEFAULT 'brand',
  contentType ENUM('caption', 'hook', 'reel_script', 'story', 'carousel', 'dm') NOT NULL DEFAULT 'caption',
  platform ENUM('instagram', 'tiktok', 'facebook', 'youtube') NOT NULL DEFAULT 'instagram',
  tags TEXT,
  isGoodExample BOOLEAN DEFAULT TRUE,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Bot rules - do/dont, tone, style
CREATE TABLE IF NOT EXISTS bot_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  category ENUM('tone', 'words_use', 'words_avoid', 'structure', 'cta', 'emoji', 'hashtag', 'general') NOT NULL,
  rule TEXT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Bot generations - content the bot created
CREATE TABLE IF NOT EXISTS bot_generations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  inputType ENUM('topic', 'image', 'video', 'competitor_post', 'trend') NOT NULL,
  inputText TEXT,
  inputMediaUrl VARCHAR(500),
  audience ENUM('wedding', 'course', 'brand') NOT NULL DEFAULT 'brand',
  platform ENUM('instagram', 'tiktok', 'facebook', 'youtube') NOT NULL DEFAULT 'instagram',
  contentType ENUM('caption', 'hook', 'reel_script', 'story', 'carousel') NOT NULL DEFAULT 'caption',
  generatedContent TEXT NOT NULL,
  hook VARCHAR(500),
  cta VARCHAR(500),
  hashtags TEXT,
  rating INT,
  feedback TEXT,
  isPublished BOOLEAN DEFAULT FALSE,
  publishedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Enhanced competitor tracking with Meta data
CREATE TABLE IF NOT EXISTS competitor_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competitorId INT NOT NULL,
  followers INT,
  following INT,
  postsCount INT,
  avgLikes INT,
  avgComments INT,
  avgShares INT,
  engagementRate DECIMAL(5,2),
  topPostUrl VARCHAR(500),
  topPostLikes INT,
  topPostCaption TEXT,
  contentFrequency VARCHAR(50),
  mainHashtags TEXT,
  snapshotDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (competitorId) REFERENCES competitors(id)
);

-- Campaign tracking - for Meta Ads integration via Manus
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  audience ENUM('wedding', 'course', 'brand', 'rental') NOT NULL,
  platform ENUM('instagram', 'facebook', 'meta_ads') NOT NULL DEFAULT 'instagram',
  status ENUM('draft', 'active', 'paused', 'completed') NOT NULL DEFAULT 'draft',
  budget INT,
  spent INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  leads INT DEFAULT 0,
  conversions INT DEFAULT 0,
  costPerLead DECIMAL(10,2),
  metaAdId VARCHAR(255),
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
