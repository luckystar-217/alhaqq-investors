-- Initialize AlHaqq Investors database schema for Neon
-- This script sets up the complete database structure with real data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS holdings CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS market_data CASCADE;
DROP TABLE IF EXISTS investment_strategies CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table for extended information
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location VARCHAR(255),
    website_url TEXT,
    occupation VARCHAR(255),
    cover_image_url TEXT,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "email_visibility": "private"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User statistics table
CREATE TABLE user_stats (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    post_count INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    portfolio_count INTEGER DEFAULT 0,
    total_portfolio_value DECIMAL(15,2) DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table for social features
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment strategies table
CREATE TABLE investment_strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy_type VARCHAR(100),
    risk_level VARCHAR(50),
    expected_return DECIMAL(5,2),
    time_horizon VARCHAR(50),
    min_investment DECIMAL(15,2),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market data cache table
CREATE TABLE IF NOT EXISTS market_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    change_24h DECIMAL(10,4) DEFAULT 0.0000,
    volume BIGINT DEFAULT 0,
    market_cap BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment portfolios
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_value DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment holdings
CREATE TABLE IF NOT EXISTS holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(15,8) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    current_price DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User follows/connections
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Post likes
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_holdings_portfolio_id ON holdings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_market_data_symbol ON market_data(symbol);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON holdings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample users
INSERT INTO users (email, name, username, password_hash, bio, location) VALUES
('ahmed@alhaqq.com', 'Ahmed Al-Rashid', 'ahmed_rashid', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Islamic finance expert and halal investment advocate', 'Dubai, UAE'),
('fatima@alhaqq.com', 'Fatima Hassan', 'fatima_hassan', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Sharia-compliant portfolio manager', 'Kuala Lumpur, Malaysia'),
('omar@alhaqq.com', 'Omar Ibn Malik', 'omar_malik', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Tech entrepreneur focused on ethical investments', 'London, UK'),
('aisha@alhaqq.com', 'Aisha Abdullahi', 'aisha_abdullahi', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Financial advisor specializing in Islamic banking', 'Istanbul, Turkey')
ON CONFLICT (email) DO NOTHING;

-- Insert user profiles
INSERT INTO user_profiles (user_id, bio, location, website_url, occupation) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Senior Investment Analyst specializing in Islamic finance and halal investments. 10+ years experience in portfolio management.', 'Dubai, UAE', 'https://ahmed-hassan.com', 'Investment Analyst'),
('550e8400-e29b-41d4-a716-446655440002', 'Fintech entrepreneur and advocate for ethical investing. Building the future of Islamic finance technology.', 'London, UK', 'https://fatima-ventures.com', 'Fintech Entrepreneur'),
('550e8400-e29b-41d4-a716-446655440003', 'Real estate investor focused on Sharia-compliant properties. Sharing insights on halal real estate opportunities.', 'Kuala Lumpur, Malaysia', NULL, 'Real Estate Investor'),
('550e8400-e29b-41d4-a716-446655440004', 'Financial advisor helping Muslims build wealth through halal investments. Certified Islamic Finance Professional.', 'Toronto, Canada', 'https://halalwealth.ca', 'Financial Advisor');

-- Insert user stats
INSERT INTO user_stats (id, post_count, follower_count, following_count, portfolio_count, total_portfolio_value) VALUES
('550e8400-e29b-41d4-a716-446655440001', 45, 2847, 156, 3, 125000.00),
('550e8400-e29b-41d4-a716-446655440002', 32, 1923, 89, 2, 89500.00),
('550e8400-e29b-41d4-a716-446655440003', 28, 1456, 234, 4, 156000.00),
('550e8400-e29b-41d4-a716-446655440004', 51, 3201, 178, 2, 78000.00);

-- Insert sample market data
INSERT INTO market_data (symbol, name, price, change_24h, volume, market_cap) VALUES
('AAPL', 'Apple Inc.', 175.43, 2.15, 45000000, 2800000000000),
('MSFT', 'Microsoft Corporation', 338.11, 1.87, 28000000, 2500000000000),
('GOOGL', 'Alphabet Inc.', 125.37, -0.95, 32000000, 1600000000000),
('TSLA', 'Tesla Inc.', 248.50, 3.42, 55000000, 790000000000),
('NVDA', 'NVIDIA Corporation', 421.13, 4.23, 38000000, 1040000000000),
('META', 'Meta Platforms Inc.', 296.73, -1.12, 22000000, 750000000000),
('BTC', 'Bitcoin', 43250.00, 2.85, 15000000000, 850000000000),
('ETH', 'Ethereum', 2650.00, 1.95, 8000000000, 320000000000)
ON CONFLICT (symbol) DO UPDATE SET
    price = EXCLUDED.price,
    change_24h = EXCLUDED.change_24h,
    volume = EXCLUDED.volume,
    market_cap = EXCLUDED.market_cap,
    updated_at = NOW();

-- Insert sample investment strategies
INSERT INTO investment_strategies (id, name, description, strategy_type, risk_level, expected_return, time_horizon, min_investment) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Halal Growth Portfolio', 'Diversified portfolio of Sharia-compliant growth stocks focusing on technology and healthcare sectors.', 'Growth', 'Moderate', 8.5, 'Long-term (5+ years)', 5000.00),
('650e8400-e29b-41d4-a716-446655440002', 'Islamic Real Estate Investment', 'Real estate investment strategy focusing on commercial and residential properties that comply with Islamic principles.', 'Real Estate', 'Low', 6.2, 'Medium-term (3-5 years)', 25000.00),
('650e8400-e29b-41d4-a716-446655440003', 'Ethical Tech Fund', 'Investment in technology companies that align with Islamic values and avoid prohibited business activities.', 'Technology', 'High', 12.3, 'Long-term (5+ years)', 10000.00);

-- Insert sample portfolios
INSERT INTO portfolios (user_id, name, description, total_value) 
SELECT 
    u.id,
    'Halal Tech Portfolio',
    'Technology companies that comply with Islamic finance principles',
    125000.00
FROM users u WHERE u.username = 'ahmed_rashid'
ON CONFLICT DO NOTHING;

INSERT INTO portfolios (user_id, name, description, total_value) 
SELECT 
    u.id,
    'Sharia Growth Fund',
    'Diversified portfolio of sharia-compliant investments',
    85000.00
FROM users u WHERE u.username = 'fatima_hassan'
ON CONFLICT DO NOTHING;

-- Insert sample posts
INSERT INTO posts (user_id, content, likes_count) 
SELECT 
    u.id,
    'Just analyzed the latest earnings from Apple. Their focus on privacy and ethical business practices aligns well with Islamic investment principles. Considering adding more AAPL to my halal portfolio. #HalalInvesting #TechStocks',
    15
FROM users u WHERE u.username = 'ahmed_rashid';

INSERT INTO posts (user_id, content, likes_count) 
SELECT 
    u.id,
    'Reminder: Always ensure your investments are sharia-compliant. Avoid companies with high debt ratios or involvement in prohibited industries. Research is key! 📊 #IslamicFinance #InvestmentTips',
    23
FROM users u WHERE u.username = 'fatima_hassan';

INSERT INTO posts (user_id, content, likes_count) 
SELECT 
    u.id,
    'The rise of ESG investing aligns beautifully with Islamic finance principles. Companies focusing on environmental and social responsibility often make excellent halal investments. 🌱 #ESG #HalalInvesting',
    18
FROM users u WHERE u.username = 'omar_malik';

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'like', 'New Like', 'Fatima Ali liked your post about Apple analysis'),
('550e8400-e29b-41d4-a716-446655440001', 'follow', 'New Follower', 'Omar Ibrahim started following you'),
('550e8400-e29b-41d4-a716-446655440002', 'comment', 'New Comment', 'Ahmed Hassan commented on your fintech announcement'),
('550e8400-e29b-41d4-a716-446655440003', 'portfolio', 'Portfolio Update', 'Your Real Estate Portfolio gained 2.3% today');

-- Create views for common queries
CREATE VIEW user_feed AS
SELECT 
    p.id,
    p.content,
    p.image_url,
    p.likes_count,
    p.comments_count,
    p.created_at,
    u.name,
    u.username,
    u.avatar_url,
    u.is_verified
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

CREATE VIEW portfolio_summary AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.total_value,
    p.created_at,
    u.name as owner_name,
    u.username as owner_username
FROM portfolios p
JOIN users u ON p.user_id = u.id;
