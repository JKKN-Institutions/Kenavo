-- Insert the 10 standard alumni profile questions
-- These are the questions currently displayed on profile pages

INSERT INTO profile_questions (question_text, order_index, is_active) VALUES
('A school memory that still makes you smile', 1, true),
('Your favourite spot in school', 2, true),
('If you get one full day in school today, what would you do...', 3, true),
('What advice would you give to the younger students entering the workforce today:', 4, true),
('A book / movie / experience that changed your perspective of life:', 5, true),
('A personal achievement that means a lot to you:', 6, true),
('Your favourite hobby that you pursue when off work:', 7, true),
('Your favourite go-to song(s) to enliven your spirits', 8, true),
('What does reconnecting with this alumini group mean to you at this stage of your life?', 9, true),
('Would you be open to mentoring younger students or collaborating with alumni?', 10, true)
ON CONFLICT DO NOTHING;

-- Verify insertion
SELECT id, question_text, order_index
FROM profile_questions
ORDER BY order_index;
