-- Insert all 49 areas into the database
INSERT INTO areas (id, name, name_ar, city, city_ar, slug, image) VALUES
-- New Cairo
(1, 'First Settlement', 'التجمع الأول', 'New Cairo', 'القاهرة الجديدة', 'first-settlement', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
(2, 'Third Settlement', 'التجمع الثالث', 'New Cairo', 'القاهرة الجديدة', 'third-settlement', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
(3, 'Fifth Settlement', 'التجمع الخامس', 'New Cairo', 'القاهرة الجديدة', 'fifth-settlement', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
(4, 'South Teseen', 'جنوب التسعين', 'New Cairo', 'القاهرة الجديدة', 'south-teseen', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
(5, 'North Teseen', 'شمال التسعين', 'New Cairo', 'القاهرة الجديدة', 'north-teseen', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'),
(6, 'Al Yasmeen', 'الياسمين', 'New Cairo', 'القاهرة الجديدة', 'al-yasmeen', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'),
(7, 'Al Banafseg', 'البنفسج', 'New Cairo', 'القاهرة الجديدة', 'al-banafseg', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80'),
(8, 'Al Lotus', 'اللوتس', 'New Cairo', 'القاهرة الجديدة', 'al-lotus', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'),
(9, 'Al Narges', 'النرجس', 'New Cairo', 'القاهرة الجديدة', 'al-narges', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80'),
(10, 'South Academy', 'جنوب الأكاديمية', 'New Cairo', 'القاهرة الجديدة', 'south-academy', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=800&q=80'),
(11, 'West Arabella', 'غرب أرابيلا', 'New Cairo', 'القاهرة الجديدة', 'west-arabella', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80'),
(12, 'Al Kornfol', 'القرنفل', 'New Cairo', 'القاهرة الجديدة', 'al-kornfol', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800&q=80'),
(13, 'Diplomats District', 'حي الدبلوماسيين', 'New Cairo', 'القاهرة الجديدة', 'diplomats-district', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'),

-- Nasr City
(14, 'Abbas Al Akkad', 'عباس العقاد', 'Nasr City', 'مدينة نصر', 'abbas-al-akkad', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'),
(15, 'Makram Ebeid', 'مكرم عبيد', 'Nasr City', 'مدينة نصر', 'makram-ebeid', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
(16, 'Mostafa El Nahas', 'مصطفى النحاس', 'Nasr City', 'مدينة نصر', 'mostafa-el-nahas', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'),
(17, 'Petroleum Area', 'منطقة البترول', 'Nasr City', 'مدينة نصر', 'petroleum-area', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'),
(18, 'District 7', 'الحي السابع', 'Nasr City', 'مدينة نصر', 'district-7', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80'),
(19, 'District 10', 'الحي العاشر', 'Nasr City', 'مدينة نصر', 'district-10', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'),

-- Heliopolis
(20, 'Korba', 'كوربة', 'Heliopolis', 'مصر الجديدة', 'korba', 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=800&q=80'),
(21, 'Ard El Golf', 'أرض الجولف', 'Heliopolis', 'مصر الجديدة', 'ard-el-golf', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'),
(22, 'Sheraton', 'شيراتون', 'Heliopolis', 'مصر الجديدة', 'sheraton', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'),
(23, 'Almazah', 'الماظة', 'Heliopolis', 'مصر الجديدة', 'almazah', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
(24, 'Nozha', 'النزهة', 'Heliopolis', 'مصر الجديدة', 'nozha', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),

-- Maadi
(25, 'Degla Maadi', 'دجلة المعادي', 'Maadi', 'المعادي', 'degla-maadi', 'https://images.unsplash.com/photo-1582719478250-c5a9e5d41e48?auto=format&fit=crop&w=800&q=80'),
(26, 'Zahraa Maadi', 'زهراء المعادي', 'Maadi', 'المعادي', 'zahraa-maadi', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'),
(27, 'New Maadi', 'المعادي الجديدة', 'Maadi', 'المعادي', 'new-maadi', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'),
(28, 'Maadi Corniche', 'كورنيش المعادي', 'Maadi', 'المعادي', 'maadi-corniche', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),

-- 6 October
(29, 'Sheikh Zayed', 'الشيخ زايد', '6 October', '6 أكتوبر', 'sheikh-zayed', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
(30, '3rd District', 'الحي الثالث', '6 October', '6 أكتوبر', '3rd-district', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'),
(31, '5th District', 'الحي الخامس', '6 October', '6 أكتوبر', '5th-district', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'),
(32, '8th District', 'الحي الثامن', '6 October', '6 أكتوبر', '8th-district', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80'),
(33, '11th District', 'الحي الحادي عشر', '6 October', '6 أكتوبر', '11th-district', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'),
(34, '12th District', 'الحي الثاني عشر', '6 October', '6 أكتوبر', '12th-district', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80'),
(35, 'Hadayek October', 'حدائق أكتوبر', '6 October', '6 أكتوبر', 'hadayek-october', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=800&q=80'),
(36, 'New October', 'أكتوبر الجديدة', '6 October', '6 أكتوبر', 'new-october', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80'),
(37, 'Beverly Hills', 'بيفرلي هيلز', '6 October', '6 أكتوبر', 'beverly-hills', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800&q=80'),

-- New Capital
(38, 'R7', 'R7', 'New Capital', 'العاصمة الإدارية', 'r7', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'),
(39, 'R8', 'R8', 'New Capital', 'العاصمة الإدارية', 'r8', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
(40, 'Downtown', 'الداون تاون', 'New Capital', 'العاصمة الإدارية', 'downtown', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'),
(41, 'Diplomatic District', 'الحي الدبلوماسي', 'New Capital', 'العاصمة الإدارية', 'diplomatic-district', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'),
(42, 'Government District', 'الحي الحكومي', 'New Capital', 'العاصمة الإدارية', 'government-district', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80'),
(43, 'Financial District', 'الحي المالي', 'New Capital', 'العاصمة الإدارية', 'financial-district', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'),

-- Other Areas
(44, 'Zamalek', 'الزمالك', 'Cairo', 'القاهرة', 'zamalek', 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=800&q=80'),
(45, 'Dokki', 'الدقي', 'Cairo', 'القاهرة', 'dokki', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'),
(46, 'Mohandessin', 'المهندسين', 'Cairo', 'القاهرة', 'mohandessin', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'),
(47, 'Garden City', 'جاردن سيتي', 'Cairo', 'القاهرة', 'garden-city', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
(48, 'Downtown Cairo', 'وسط البلد', 'Cairo', 'القاهرة', 'downtown-cairo', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
(49, 'El Mokattam', 'المقطم', 'Cairo', 'القاهرة', 'el-mokattam', 'https://images.unsplash.com/photo-1582719478250-c5a9e5d41e48?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence to continue from 50
SELECT setval('areas_id_seq', 49, true);
