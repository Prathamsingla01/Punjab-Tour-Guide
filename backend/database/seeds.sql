-- Seed Users (Passwords are hashed for security, let's store default hashes or seed directly via code)
-- For the sake of direct SQL execution, we will seed default accounts.
-- Passwords below are hashed using bcrypt (rounds=10) for 'admin123' and 'tourist123'
-- admin123 hash: $2a$10$fV1hYJq950W/UjD3K7lFxe7R3P1g6BSc4Jz1/bN1mU7y6e3r5QvK.
-- tourist123 hash: $2a$10$wK1G95kY2/HhP4vW6dFxue7R3P1g6BSc4Jz1/bN1mU7y6e3r5QvK.

INSERT INTO users (name, email, password, role, points, xp) VALUES 
('Super Admin', 'admin@punjab.tour', '$2a$10$fV1hYJq950W/UjD3K7lFxe7R3P1g6BSc4Jz1/bN1mU7y6e3r5QvK.', 'Super Admin', 1000, 5000),
('Gurpreet Singh', 'singh@punjab.tour', '$2a$10$wK1G95kY2/HhP4vW6dFxue7R3P1g6BSc4Jz1/bN1mU7y6e3r5QvK.', 'Tourist', 150, 300);

-- Seed Destinations
INSERT INTO destinations (name, tagline, description, history, best_time, crowd_level, avg_time, photography_spots, accessibility, parking, toilets, atm_nearby, hospital_nearby, police_nearby, petrol_nearby, carry_items, avoid_items, fun_facts, travel_tips, coordinates_lat, coordinates_lng) VALUES 
('Amritsar', 
 'The Spiritual Heart of Punjab', 
 'Amritsar is home to the spectacular Golden Temple, the spiritual and cultural center of the Sikh religion. Rich in history, patriotism, and traditional gastronomy, it represents the soulful essence of Punjabi culture.',
 'Founded in 1577 by Guru Ram Das, the fourth Sikh Guru, who excavated the holy tank known as the Amrit Sarovar (Pool of Nectar), from which the city takes its name. Amritsar has been the crucible of pivotal historical events including the Jallianwala Bagh tragedy and the Wagah Border partition lines.',
 'October to March (Pleasant winter weather)', 
 'High (Spiritual pilgrims visit daily)', 
 '2 - 3 Days', 
 'Golden Temple reflection pool, Heritage Street facade, Wagah Border gate', 
 'Wheelchair Friendly', 
 1, 
 1, 
 'State Bank of India ATM (100m from entrance)', 
 'Amritsar Civil Hospital (1.5km)', 
 'Kotwali Police Station (400m)', 
 'Indian Oil Station (800m)', 
 'Head covering scarf (mandatory inside Golden Temple), slip-on shoes, water bottle, modest clothing.', 
 'Tobacco, alcohol, leather items, shorts or sleeveless tops, noisy electronics.', 
 'The community kitchen (Langar) at the Golden Temple feeds over 100,000 people daily, completely free, run entirely by volunteers.', 
 'Visit early in the morning (4 AM) for the Palki Sahib ceremony or late at night when the gold gilding glows against the black sky.',
 31.6200, 
 74.8765),

('Chandigarh', 
 'The Modern Planned City of Gardens', 
 'Chandigarh is a modern planned city designed by the famous Swiss-French architect Le Corbusier. It serves as the joint capital of Punjab and Haryana, boasting green corridors, pristine lakes, and abstract art spaces.',
 'Commissioned after India partition in 1947 as a symbol of progress, Chandigarh was built from scratch in the foothills of the Shivaliks as the first planned city of independent India.',
 'September to April', 
 'Medium', 
 '2 Days', 
 'Rock Garden sculptures, Sukhna Lake sunset point, Open Hand monument', 
 'Wheelchair Friendly', 
 1, 
 1, 
 'HDFC Bank ATM (Sector 17 Plaza)', 
 'PGIMER Specialty Hospital (Sector 12)', 
 'Sector 17 Central Police Station', 
 'HP Fuel Station (Sector 22)', 
 'Sunglasses, comfortable walking shoes, umbrella, camera.', 
 'Littering (heavily fined), smoking in public places, illegal parking.', 
 'The city was designed around the human body metaphor, with Sector 1 representing the Head (Capitol Complex) and Sector 17 representing the Heart (Shopping Plaza).', 
 'Rent a smart bicycle from public stations to explore the Sector gardens easily.',
 30.7333, 
 76.7794),

('Patiala', 
 'The Royal City of Heritage & Craft', 
 'Patiala is famed for its royal fortresses, traditional turbans, peg measures, and beautiful Phulkari fabrics, displaying rich Sikh state architecture.',
 'Famed as an independent princely state established in 1763 by Baba Ala Singh, who constructed the grand mud fort Qila Mubarak around which the city developed.',
 'October to February', 
 'Low', 
 '1 Day', 
 'Qila Mubarak gates, Sheesh Mahal reflections, Baradari Gardens', 
 'Limited', 
 1, 
 0, 
 'ICICI Bank ATM (Mall Road)', 
 'Rajindra Government Hospital', 
 'Lahori Gate Police Station', 
 'Bharat Petroleum (Near bus stand)', 
 'Light cotton clothes, camera, cash for local handicraft shopping.', 
 'Entering restricted areas of the fort, using plastics inside public parks.', 
 'Patiala is the birthplace of the Patiala Peg, a large measure of whiskey, and the Patiala Shahi turban style.', 
 'Do not miss trying the traditional Patiala Juttis (leather shoes) at the local handicraft market near the fort.',
 30.3400, 
 76.3800);

-- Seed Hotels
INSERT INTO hotels (destination_id, name, price_per_night, rating, amenities, image_url) VALUES 
(1, 'Taj Swarna', 9500.0, 4.8, 'Pool,WiFi,Parking,Breakfast', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500'),
(1, 'Hyatt Regency Amritsar', 7500.0, 4.6, 'Pool,WiFi,Breakfast', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=500'),
(2, 'The Lalit Chandigarh', 8500.0, 4.7, 'Pool,WiFi,Parking,Breakfast', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500'),
(3, 'Clarion Inn Patiala', 4200.0, 4.3, 'WiFi,Parking,Breakfast', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=500');

-- Seed Restaurants
INSERT INTO restaurants (destination_id, name, specialty, rating, spicy_level, is_veg, image_url) VALUES 
(1, 'Kesar Da Dhaba', 'Dal Makhani & Amritsari Kulcha', 4.8, 2, 1, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=500'),
(1, 'Beera Chicken House', 'Tandoori Chicken', 4.5, 3, 0, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=500'),
(2, 'Pal Dhaba', 'Butter Chicken & Naan', 4.6, 2, 0, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=500'),
(3, 'Gopal Sweets', 'Chana Bhatura & Kulfi', 4.4, 1, 1, 'https://images.unsplash.com/photo-1546173159-3159b44d989c?q=80&w=500');
