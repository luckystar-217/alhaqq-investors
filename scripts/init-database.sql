-- Initialize AlHaqq Investors database schema for Neon
-- This script sets up the complete database structure with real data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS user_follows CASCADE;
DROP TABLE IF EXISTS holdings CASCADE;
DROP TABLE IF EXISTS portfolio_performance CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS market_data CASCADE;
DROP TABLE IF EXISTS investment_strategies CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,
    stack_user_id VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
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
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images TEXT[],
    post_type VARCHAR(50) DEFAULT 'general',
    tags TEXT[],
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
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
CREATE TABLE market_data (
    symbol VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255),
    current_price DECIMAL(15,8) NOT NULL,
    change_24h DECIMAL(15,8),
    change_percentage_24h DECIMAL(8,4),
    market_cap DECIMAL(20,2),
    volume_24h DECIMAL(20,2),
    high_24h DECIMAL(15,8),
    low_24h DECIMAL(15,8),
    asset_type VARCHAR(50) DEFAULT 'stock',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment portfolios
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    portfolio_type VARCHAR(100) DEFAULT 'personal',
    risk_level VARCHAR(50) DEFAULT 'moderate',
    total_value DECIMAL(15,2) DEFAULT 0,
    total_return DECIMAL(15,2) DEFAULT 0,
    return_percentage DECIMAL(8,4) DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio performance table
CREATE TABLE portfolio_performance (
    id UUID PRIMARY KEY REFERENCES portfolios(id) ON DELETE CASCADE,
    holding_count INTEGER DEFAULT 0,
    avg_holding_return DECIMAL(8,4) DEFAULT 0,
    best_performer VARCHAR(20),
    worst_performer VARCHAR(20),
    last_rebalanced TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment holdings
CREATE TABLE holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    quantity DECIMAL(20,8) NOT NULL,
    average_cost DECIMAL(15,8) NOT NULL,
    current_price DECIMAL(15,8),
    market_value DECIMAL(15,2),
    total_return DECIMAL(15,2),
    return_percentage DECIMAL(8,4),
    asset_type VARCHAR(50) DEFAULT 'stock',
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(portfolio_id, symbol)
);

-- User follows/connections
CREATE TABLE user_follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Post comments
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES post_comments(id),
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes
CREATE TABLE post_likes (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_stack_user_id ON users(stack_user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_holdings_portfolio_id ON holdings(portfolio_id);
CREATE INDEX idx_holdings_symbol ON holdings(symbol);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_market_data_asset_type ON market_data(asset_type);

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

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at BEFORE UPDATE ON holdings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample users
INSERT INTO users (id, email, username, full_name, avatar_url, is_verified, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ahmed.hassan@alhaqq.com', 'ahmed_hassan', 'Ahmed Hassan', '/placeholder-user.jpg', true, true),
('550e8400-e29b-41d4-a716-446655440002', 'fatima.ali@alhaqq.com', 'fatima_ali', 'Fatima Ali', '/placeholder-user.jpg', true, true),
('550e8400-e29b-41d4-a716-446655440003', 'omar.ibrahim@alhaqq.com', 'omar_ibrahim', 'Omar Ibrahim', '/placeholder-user.jpg', false, true),
('550e8400-e29b-41d4-a716-446655440004', 'sara.mohamed@alhaqq.com', 'sara_mohamed', 'Sara Mohamed', '/placeholder-user.jpg', false, true);

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
INSERT INTO market_data (symbol, name, current_price, change_24h, change_percentage_24h, market_cap, volume_24h, asset_type) VALUES
('AAPL', 'Apple Inc.', 175.43, 2.15, 1.24, 2800000000000, 45000000000, 'stock'),
('MSFT', 'Microsoft Corporation', 338.11, -1.23, -0.36, 2500000000000, 32000000000, 'stock'),
('GOOGL', 'Alphabet Inc.', 125.37, 0.87, 0.70, 1600000000000, 28000000000, 'stock'),
('TSLA', 'Tesla Inc.', 248.50, 5.20, 2.14, 790000000000, 18000000000, 'stock'),
('NVDA', 'NVIDIA Corporation', 421.13, 8.45, 2.05, 1040000000000, 22000000000, 'stock'),
('BTC', 'Bitcoin', 43250.00, 1250.00, 2.98, 850000000000, 15000000000, 'crypto'),
('ETH', 'Ethereum', 2650.00, 85.50, 3.34, 320000000000, 8000000000, 'crypto'),
('GOLD', 'Gold Futures', 2045.50, -12.30, -0.60, NULL, 2500000000, 'commodity');

-- Insert sample investment strategies
INSERT INTO investment_strategies (id, name, description, strategy_type, risk_level, expected_return, time_horizon, min_investment) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Halal Growth Portfolio', 'Diversified portfolio of Sharia-compliant growth stocks focusing on technology and healthcare sectors.', 'Growth', 'Moderate', 8.5, 'Long-term (5+ years)', 5000.00),
('650e8400-e29b-41d4-a716-446655440002', 'Islamic Real Estate Investment', 'Real estate investment strategy focusing on commercial and residential properties that comply with Islamic principles.', 'Real Estate', 'Low', 6.2, 'Medium-term (3-5 years)', 25000.00),
('650e8400-e29b-41d4-a716-446655440003', 'Ethical Tech Fund', 'Investment in technology companies that align with Islamic values and avoid prohibited business activities.', 'Technology', 'High', 12.3, 'Long-term (5+ years)', 10000.00);

-- Insert sample portfolios
INSERT INTO portfolios (id, user_id, name, description, portfolio_type, risk_level, total_value, is_public) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Halal Tech Growth', 'Technology-focused portfolio with Sharia-compliant stocks', 'growth', 'moderate', 85000.00, true),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Conservative Income', 'Low-risk portfolio focused on dividend-paying halal stocks', 'income', 'low', 40000.00, false),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Ethical Investment Fund', 'Diversified portfolio of ESG and Sharia-compliant investments', 'balanced', 'moderate', 89500.00, true),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Real Estate Portfolio', 'REIT-focused portfolio with halal real estate investments', 'real_estate', 'low', 156000.00, true);

-- Insert sample portfolio performance
INSERT INTO portfolio_performance (id, holding_count, avg_holding_return, best_performer, worst_performer) VALUES
('750e8400-e29b-41d4-a716-446655440001', 5, 8.45, 'NVDA', 'MSFT'),
('750e8400-e29b-41d4-a716-446655440002', 8, 4.23, 'AAPL', 'GOOGL'),
('750e8400-e29b-41d4-a716-446655440003', 6, 6.78, 'TSLA', 'MSFT'),
('750e8400-e29b-41d4-a716-446655440004', 4, 5.12, 'AAPL', 'GOOGL');

-- Insert sample holdings
INSERT INTO holdings (portfolio_id, symbol, name, quantity, average_cost, current_price, market_value, asset_type) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'AAPL', 'Apple Inc.', 100, 165.00, 175.43, 17543.00, 'stock'),
('750e8400-e29b-41d4-a716-446655440001', 'MSFT', 'Microsoft Corporation', 50, 320.00, 338.11, 16905.50, 'stock'),
('750e8400-e29b-41d4-a716-446655440001', 'NVDA', 'NVIDIA Corporation', 75, 380.00, 421.13, 31584.75, 'stock'),
('750e8400-e29b-41d4-a716-446655440001', 'TSLA', 'Tesla Inc.', 25, 235.00, 248.50, 6212.50, 'stock'),
('750e8400-e29b-41d4-a716-446655440002', 'AAPL', 'Apple Inc.', 150, 170.00, 175.43, 26314.50, 'stock'),
('750e8400-e29b-41d4-a716-446655440002', 'GOOGL', 'Alphabet Inc.', 80, 120.00, 125.37, 10029.60, 'stock'),
('750e8400-e29b-41d4-a716-446655440003', 'BTC', 'Bitcoin', 1.5, 40000.00, 43250.00, 64875.00, 'crypto'),
('750e8400-e29b-41d4-a716-446655440003', 'ETH', 'Ethereum', 8, 2400.00, 2650.00, 21200.00, 'crypto');

-- Insert sample follows
INSERT INTO user_follows (follower_id, following_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample posts
INSERT INTO posts (id, user_id, content, post_type, tags, like_count, comment_count) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Just analyzed the latest earnings from Apple. Strong fundamentals and Sharia-compliant business model make it a solid addition to halal portfolios. The services revenue growth is particularly impressive. 📈 #HalalInvesting #TechStocks', 'analysis', ARRAY['halal', 'apple', 'analysis'], 24, 8),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Excited to announce our new Islamic fintech platform is launching next month! We''re making halal investing accessible to everyone. Beta testers have seen amazing results. 🚀 #IslamicFintech #HalalInvesting', 'announcement', ARRAY['fintech', 'announcement', 'halal'], 45, 12),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Real estate market update: Seeing great opportunities in commercial properties that align with Islamic principles. The key is finding assets with stable, halal income streams. 🏢 #RealEstate #HalalInvestment', 'market_update', ARRAY['realestate', 'market', 'halal'], 18, 5),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Reminder: Diversification is key in Islamic investing. Don''t put all your eggs in one basket, even if it''s halal. Spread risk across different sectors and asset classes. 💡 #InvestmentTips #HalalWealth', 'education', ARRAY['tips', 'diversification', 'education'], 32, 7);

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
    p.images,
    p.post_type,
    p.tags,
    p.like_count,
    p.comment_count,
    p.created_at,
    u.full_name,
    u.username,
    u.avatar_url,
    u.is_verified
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.is_public = true
ORDER BY p.created_at DESC;

CREATE VIEW portfolio_summary AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.portfolio_type,
    p.risk_level,
    p.total_value,
    p.is_public,
    p.created_at,
    u.full_name as owner_name,
    u.username as owner_username,
    pp.holding_count,
    pp.avg_holding_return
FROM portfolios p
JOIN users u ON p.user_id = u.id
LEFT JOIN portfolio_performance pp ON p.id = pp.id;
