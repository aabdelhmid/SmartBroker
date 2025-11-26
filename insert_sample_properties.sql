-- Sample Properties Data for SmartBroker
-- High-quality realistic properties with images
-- Run this in Supabase SQL Editor AFTER creating the admin user profile

-- First, get the admin user ID
-- Replace 'ADMIN_USER_ID_HERE' with the actual UUID from:
-- SELECT id FROM profiles WHERE email = 'admin@smartbroker.com';

-- ============================================
-- LUXURY PROPERTIES WITH DISCOUNTS
-- ============================================

-- Property 1: Luxury Villa in First Settlement (WITH DISCOUNT)
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Villa 245, Compound Mirage, First Settlement',
    8500000,
    5,
    6,
    4500,
    'villa',
    'approved',
    'Stunning luxury villa with private pool, garden, and modern finishes. Located in a gated compound with 24/7 security.',
    'فيلا فاخرة مذهلة مع حمام سباحة خاص وحديقة وتشطيبات حديثة. تقع في كمبوند مغلق مع حراسة 24/7.',
    ARRAY['Private Pool', 'Garden', 'Maid Room', 'Smart Home', 'Garage', 'Security'],
    ARRAY[
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    1, -- First Settlement
    15, -- 15% discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 2: Modern Apartment in Fifth Settlement (WITH DISCOUNT)
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Apartment 302, Moon Valley Towers, Fifth Settlement',
    3200000,
    3,
    2,
    180,
    'apartment',
    'approved',
    'Bright and spacious apartment with stunning city views. Features modern kitchen and premium finishes throughout.',
    'شقة مشرقة وواسعة مع إطلالات مذهلة على المدينة. تتميز بمطبخ حديث وتشطيبات فاخرة.',
    ARRAY['City View', 'Balcony', 'Parking', 'Gym Access', 'Central AC'],
    ARRAY[
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80'
    ],
    3, -- Fifth Settlement
    10, -- 10% discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 3: Penthouse in Maadi (WITH DISCOUNT)
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Penthouse, Nile Towers, Degla Maadi',
    12000000,
    4,
    4,
    350,
    'apartment',
    'approved',
    'Exclusive penthouse with panoramic Nile views. Private terrace, jacuzzi, and luxury amenities.',
    'بنتهاوس حصري مع إطلالات بانورامية على النيل. تراس خاص وجاكوزي ووسائل راحة فاخرة.',
    ARRAY['Nile View', 'Private Terrace', 'Jacuzzi', 'Concierge', 'Parking', 'Storage'],
    ARRAY[
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80'
    ],
    25, -- Degla Maadi
    20, -- 20% discount (special offer!)
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- ============================================
-- REGULAR PROPERTIES (NO DISCOUNT)
-- ============================================

-- Property 4: Family Villa in Sheikh Zayed
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Villa 89, Palm Hills, Sheikh Zayed',
    6500000,
    4,
    4,
    3500,
    'villa',
    'approved',
    'Beautiful family villa in prestigious Palm Hills compound. Spacious layout with modern design.',
    'فيلا عائلية جميلة في كمبوند بالم هيلز المرموق. تصميم واسع وعصري.',
    ARRAY['Garden', 'Garage', 'Club House Access', 'Kids Area', 'Security'],
    ARRAY[
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80'
    ],
    29, -- Sheikh Zayed
    0, -- No discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 5: Cozy Apartment in Nasr City
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Apartment 501, Abbas El Akkad Street, Nasr City',
    2100000,
    2,
    2,
    130,
    'apartment',
    'approved',
    'Cozy apartment in prime location. Perfect for young couples or small families. Close to all amenities.',
    'شقة مريحة في موقع متميز. مثالية للأزواج الشباب أو العائلات الصغيرة. قريبة من جميع الخدمات.',
    ARRAY['Balcony', 'Parking', 'Elevator', 'Natural Light'],
    ARRAY[
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80'
    ],
    14, -- Abbas Al Akkad
    0, -- No discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 6: Luxury Apartment in New Capital
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Unit R7-305, Capital Business Park, New Capital',
    4800000,
    3,
    3,
    220,
    'apartment',
    'approved',
    'Brand new apartment in the heart of New Capital. Smart home features and premium finishes.',
    'شقة جديدة تماماً في قلب العاصمة الإدارية. مميزات منزل ذكي وتشطيبات فاخرة.',
    ARRAY['Smart Home', 'Gym', 'Pool', 'Concierge', 'Parking', 'Central AC'],
    ARRAY[
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
        'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
    ],
    38, -- R7, New Capital
    0, -- No discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 7: Townhouse in 6 October
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Townhouse 12, Beverly Hills, 6 October',
    5200000,
    4,
    3,
    280,
    'villa',
    'approved',
    'Modern townhouse with private garden. Ideal for families seeking comfort and style.',
    'تاون هاوس عصري مع حديقة خاصة. مثالي للعائلات التي تبحث عن الراحة والأناقة.',
    ARRAY['Garden', 'Roof Terrace', 'Parking', 'Club Access', 'Security'],
    ARRAY[
        'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566752229-250ed79470d6?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80'
    ],
    37, -- Beverly Hills
    0, -- No discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 8: Studio in Heliopolis (WITH DISCOUNT)
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Studio 204, Korba Square, Heliopolis',
    1400000,
    1,
    1,
    65,
    'apartment',
    'approved',
    'Charming studio in the heart of Korba. Perfect for singles or investors. Fully furnished option available.',
    'استوديو ساحر في قلب كوربة. مثالي للعزاب أو المستثمرين. خيار مفروش بالكامل متاح.',
    ARRAY['Furnished Option', 'Balcony', 'Elevator', 'Central Location'],
    ARRAY[
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'
    ],
    20, -- Korba
    5, -- 5% discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 9: Duplex in Third Settlement
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Duplex 45, Compound Green Park, Third Settlement',
    4500000,
    3,
    3,
    250,
    'apartment',
    'approved',
    'Spacious duplex with private entrance. Two floors of modern living with garden view.',
    'دوبلكس واسع مع مدخل خاص. طابقين من الحياة العصرية مع إطلالة على الحديقة.',
    ARRAY['Private Entrance', 'Garden View', 'Parking', 'Storage', 'Balcony'],
    ARRAY[
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80'
    ],
    2, -- Third Settlement
    0, -- No discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- Property 10: Mega Villa in New Cairo (WITH DISCOUNT)
INSERT INTO properties (
    address, price, beds, baths, sqft, type, status,
    description, description_ar, features, images, area_id, discount_percentage, agent_id
) VALUES (
    'Villa 1, Katameya Heights, New Cairo',
    18000000,
    6,
    7,
    6000,
    'villa',
    'approved',
    'Ultra-luxury villa in exclusive Katameya Heights. Golf course view, infinity pool, and world-class amenities.',
    'فيلا فاخرة للغاية في كاتاميا هايتس الحصرية. إطلالة على ملعب الجولف وحمام سباحة لا متناهي ووسائل راحة عالمية.',
    ARRAY['Golf View', 'Infinity Pool', 'Cinema Room', 'Gym', 'Maid Quarters', 'Smart Home', 'Garage'],
    ARRAY[
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80'
    ],
    1, -- First Settlement (Katameya area)
    12, -- 12% discount
    (SELECT id FROM profiles WHERE email = 'admin@smartbroker.com' LIMIT 1)
);

-- ============================================
-- SUMMARY
-- ============================================
-- Total Properties: 10
-- With Discounts: 5 (15%, 10%, 20%, 5%, 12%)
-- Without Discounts: 5
-- All properties are APPROVED and ready to display
-- All have high-quality Unsplash images
-- All have Arabic translations
