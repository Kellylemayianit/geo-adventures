-- Geo Adventures Kenya — seed data
-- Run: wrangler d1 execute geo-adventures-db --file=./migrations/0002_seed.sql --remote

DELETE FROM destinations; DELETE FROM stay_tiers; DELETE FROM transport_options;
DELETE FROM packages; DELETE FROM team; DELETE FROM stories; DELETE FROM testimonials;

INSERT INTO destinations (id, slug, name, region, tagline, description, image, activities, best_for, price_from_kes) VALUES
('amboseli','amboseli','Amboseli National Park','South Rift, near Kimana','Big elephants, bigger mountain',
 'Amboseli sits in our backyard here in Kimana — you can watch its elephant herds cross the plains with Kilimanjaro standing over them like a painting. This is usually the first park we send first-time visitors to, and the one our regulars keep coming back for.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Elephants_at_Amboseli_national_park_against_Mount_Kilimanjaro.jpg', '["Game drives","Kilimanjaro viewpoints","Maasai village visit","Birdwatching"]', 'Elephants, Kilimanjaro views, short trips from Kimana', 3500),
('maasai-mara','maasai-mara','Maasai Mara National Reserve','Narok County','Home of the great wildebeest crossing',
 'The Mara needs no introduction — endless grass, the big cats that own it, and if your dates line up, the wildebeest crossing the Mara River. It is a longer drive from Kimana, so most of our Mara packages are built for 4 days and up.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Maasai_Mara_National_Reserve_Kenya.jpg', '["Big cat game drives","Wildebeest migration (seasonal)","Hot air balloon add-on","Maasai cultural visit"]', 'Big cats, the migration, classic Kenya safari', 4200),
('tsavo-east','tsavo-east','Tsavo East National Park','Taita-Taveta County','Red elephants and open plains',
 'Tsavo East is raw and wide open — its elephants turn red from dusting themselves in the local soil. It pairs well with Amboseli on a longer circuit, and the drive down from Kimana passes some of the best roadside views in the south.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/African_Bush_Elephant_mud_bath.png', '["Game drives","Lugard Falls","Aruba Dam wildlife viewing"]', 'Red elephants, open savannah, combining with Amboseli', 3200),
('tsavo-west','tsavo-west','Tsavo West National Park','Taita-Taveta County','Volcanic hills and crystal springs',
 'Tsavo West trades open plains for volcanic hills, lava flows and the clear waters of Mzima Springs, where you can watch hippos underwater from a viewing chamber. A favourite add-on for people who want more scenery variety in one trip.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/View_of_the_Tsavo_River_in_Tsavo_West_National_Park.jpg', '["Mzima Springs","Shetani Lava Flows","Game drives","Rhino sanctuary"]', 'Scenery, springs, a change of pace from open plains', 3200),
('lake-nakuru','lake-nakuru','Lake Nakuru National Park','Great Rift Valley','Flamingos on the Rift Valley floor',
 'Deep in the Rift Valley, Lake Nakuru is where we send guests chasing flamingo photographs and rhino sightings in one stop. It fits naturally into a Rift Valley circuit alongside other lakes in the region.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Large_number_of_flamingos_at_Lake_Nakuru.jpg', '["Flamingo viewing","Rhino tracking","Baboon Cliff viewpoint"]', 'Flamingos, rhinos, Rift Valley scenery', 3000),
('nairobi-np','nairobi-national-park','Nairobi National Park','Nairobi','A safari with the city skyline behind it',
 'A convenient stop for guests flying in or out of Nairobi — real wildlife, city skyline in the background. We often use it as the first or last stop on a longer circuit rather than a standalone trip.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Nairobi_Skyline_Savannah_Kenya_May19_R1600687.jpg', '["Game drives","Animal orphanage visit","Short walking trail"]', 'Airport layovers, quick half-day safaris', 2200);

INSERT INTO stay_tiers (id, label, price_per_night_kes, description) VALUES
('budget','Budget Camp',3200,'Simple tented camps and guesthouses close to the parks — clean, comfortable, no frills.'),
('midrange','Comfort Lodge',8500,'Established lodges and tented camps with en-suite rooms, pools and proper dining.'),
('luxury','Luxury Camp',22000,'High-end tented camps and lodges — private verandas, top-tier service, prime locations.');

INSERT INTO transport_options (id, label, price_per_day_kes, capacity, icon, description) VALUES
('saloon','Saloon Car',4000,4,'car','Comfortable and economical for tarmac routes and shorter transfers around Kimana and nearby towns.'),
('4x4','4x4 Safari Land Cruiser',9500,6,'car','Pop-up roof, built for game drives and rough park tracks — our most-booked option for actual safari days.'),
('motorbike','Motorbike (Boda)',1500,1,'bike','Quick, affordable transport for solo travellers moving around Kimana town and short local hops.'),
('tuktuk','Tuktuk',2200,3,'bike','A practical, local way to move around town and to nearby lodges — light on the pocket.');

INSERT INTO packages (id, slug, title, class_label, days, destination_ids, stay_tier, transport_id, price_per_person_kes, image, summary, highlights, itinerary) VALUES
('p1','amboseli-weekend','Amboseli Weekend Escape','Budget',3,'["amboseli"]','budget','saloon',21500,'https://commons.wikimedia.org/wiki/Special:FilePath/Elephants_at_Amboseli_national_park_against_Mount_Kilimanjaro.jpg',
 'A quick, affordable dash to Amboseli from Kimana — elephants and Kilimanjaro over a long weekend.',
 '["2 nights budget camp","Two game drives","Return transport from Kimana","Maasai village stop"]',
 '[{"day":1,"title":"Kimana to Amboseli","text":"Pick-up in Kimana, afternoon game drive as you enter the park."},{"day":2,"title":"Full day in the park","text":"Morning and evening game drives, midday rest at camp."},{"day":3,"title":"Sunrise drive and return","text":"Early game drive, breakfast, drive back to Kimana."}]'),
('p2','amboseli-tsavo-circuit','Amboseli & Tsavo Circuit','Comfort',5,'["amboseli","tsavo-east","tsavo-west"]','midrange','4x4',68000,'https://commons.wikimedia.org/wiki/Special:FilePath/View_of_the_Tsavo_River_in_Tsavo_West_National_Park.jpg',
 'Elephants at Amboseli, red elephants and springs at Tsavo — the classic southern circuit done properly.',
 '["4 nights comfort lodges","Private 4x4 throughout","Mzima Springs visit","Park fees included"]',
 '[{"day":1,"title":"Kimana to Amboseli","text":"Afternoon game drive on arrival."},{"day":2,"title":"Amboseli full day","text":"Elephants and Kilimanjaro views, morning and evening drives."},{"day":3,"title":"Transfer to Tsavo West","text":"Mzima Springs hippo-viewing chamber in the afternoon."},{"day":4,"title":"Tsavo East","text":"Cross into Tsavo East, game drive toward Aruba Dam."},{"day":5,"title":"Return to Kimana","text":"Morning drive, then transfer home."}]'),
('p3','mara-migration-luxury','Maasai Mara Migration Luxury','Luxury',4,'["maasai-mara"]','luxury','4x4',145000,'https://commons.wikimedia.org/wiki/Special:FilePath/Maasai_Mara_National_Reserve_Kenya.jpg',
 'Front-row seats to the Mara, in a luxury tented camp on the reserve''s edge.',
 '["3 nights luxury tented camp","Private 4x4 with pop-up roof","Optional balloon safari add-on","Cultural Maasai village visit"]',
 '[{"day":1,"title":"Kimana to Maasai Mara","text":"Scenic transfer through the Rift Valley, evening game drive."},{"day":2,"title":"Full day in the Mara","text":"Big cat tracking, optional balloon safari at dawn."},{"day":3,"title":"Mara River & culture","text":"Migration crossing points (seasonal), Maasai village visit."},{"day":4,"title":"Morning drive and return","text":"Last game drive, transfer back to Kimana."}]'),
('p4','rift-valley-explorer','Rift Valley Explorer','Comfort',6,'["lake-nakuru","maasai-mara"]','midrange','4x4',92000,'https://commons.wikimedia.org/wiki/Special:FilePath/Large_number_of_flamingos_at_Lake_Nakuru.jpg',
 'Flamingos and rhinos at Lake Nakuru, then on to the Mara — the full Rift Valley story in one trip.',
 '["5 nights comfort lodges","Private 4x4 throughout","Rhino tracking at Nakuru","Big cat drives in the Mara"]',
 '[{"day":1,"title":"Kimana to Nakuru","text":"Long transfer, arrive in time for an evening game drive."},{"day":2,"title":"Lake Nakuru full day","text":"Flamingos, rhino tracking, Baboon Cliff viewpoint."},{"day":3,"title":"Transfer to Maasai Mara","text":"Scenic drive across the valley floor."},{"day":4,"title":"Mara full day","text":"Morning and evening game drives."},{"day":5,"title":"Mara River area","text":"Migration crossing points (seasonal) and culture visit."},{"day":6,"title":"Return to Kimana","text":"Morning drive, transfer home."}]'),
('p5','kimana-day-safari','Kimana Day Safari','Budget',1,'["amboseli"]','budget','saloon',8500,'https://commons.wikimedia.org/wiki/Special:FilePath/Elephants_at_Amboseli_national_park_against_Mount_Kilimanjaro.jpg',
 'No time for a full trip? A single day in Amboseli, out and back from Kimana before dark.',
 '["Full day game drive","Packed lunch","Return transport from Kimana","No overnight needed"]',
 '[{"day":1,"title":"Kimana to Amboseli and back","text":"Early pick-up, full day game drive, drop-off in Kimana by evening."}]'),
('p6','grand-southern-luxury','Grand Southern Circuit','Luxury',7,'["amboseli","tsavo-west","tsavo-east"]','luxury','4x4',210000,'https://commons.wikimedia.org/wiki/Special:FilePath/View_of_the_Tsavo_River_in_Tsavo_West_National_Park.jpg',
 'The full southern circuit at a slower, more indulgent pace — Amboseli and both Tsavo parks in luxury camps.',
 '["6 nights luxury camps","Private 4x4 with driver-guide throughout","All park fees included","Mzima Springs & Shetani Lava Flows"]',
 '[{"day":1,"title":"Kimana to Amboseli","text":"Settle into camp, evening game drive."},{"day":2,"title":"Amboseli full day","text":"Elephants and Kilimanjaro, two game drives."},{"day":3,"title":"Transfer to Tsavo West","text":"Mzima Springs, afternoon at leisure."},{"day":4,"title":"Tsavo West full day","text":"Shetani Lava Flows, rhino sanctuary visit."},{"day":5,"title":"Transfer to Tsavo East","text":"Game drive en route, evening at Aruba Dam."},{"day":6,"title":"Tsavo East full day","text":"Morning and evening game drives."},{"day":7,"title":"Return to Kimana","text":"Relaxed morning, transfer home."}]');

INSERT INTO team (id, name, role, bio, image) VALUES
('t1','Kelly Lemayian','Founder & Lead Guide','Grew up around Kimana and Amboseli, and has been guiding visitors through the south for years.','(unused)'),
('t2','Naserian Sankale','Bookings & Guest Care','Handles every enquiry personally — the first voice most guests hear on WhatsApp.','(unused)'),
('t3','Joseph Mwangangi','Driver-Guide, 4x4 Fleet','Knows the Tsavo and Amboseli tracks like the back of his hand.','(unused)'),
('t4','Grace Wanjiru','Transport Coordinator','Matches every booking to the right vehicle, from saloon cars to the safari Land Cruisers.','(unused)');

INSERT INTO stories (id, slug, title, date, excerpt, image, body) VALUES
('s1','why-we-start-in-kimana','Why Every Journey Starts in Kimana','2026-07-12',
 'Kimana is not just our address — it is the reason our Amboseli trips are shorter, cheaper, and better timed than most.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/1993_158-11A_Masai_Mara_sunset.jpg',
 'Most safari companies operate out of Nairobi and treat the south as a long drive away. We are based right here in Kimana, minutes from the Amboseli gate, which means our guests spend less time on the road and more time watching elephants. It also means we know which camps are quiet in high season, which routes flood after the rains, and which guides actually grew up on this land.'),
('s2','reading-amboseli-elephants','How to Read an Amboseli Elephant Herd','2026-06-02',
 'A short guide to what our guides are actually looking at during a morning game drive.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Elephants_at_Amboseli_national_park_against_Mount_Kilimanjaro.jpg',
 'Watch the matriarch first — she decides when the herd moves and where. Calves stay tucked between adults, never at the edge. A herd spread wide and relaxed means no danger nearby; a tight, alert cluster means they have sensed something. This is the kind of detail our driver-guides point out on every Amboseli drive.'),
('s3','build-your-own-safari-explained','Build-Your-Own Safari, Explained','2026-05-18',
 'Most of our fixed packages exist because guests kept asking for the same combinations — but you can also build your own from scratch.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Morning_Samburu_National_Reserve_landscape_with_safari_vehicle,_Kenya.jpg',
 'Pick a park or two, choose your stay tier, choose your transport, tell us your travel dates and number of people. We price it live and confirm over WhatsApp. It works exactly like our fixed packages behind the scenes — we are just letting you choose the pieces yourself.');

INSERT INTO testimonials (id, name, text, rating) VALUES
('r1','Amina H.','Booked the Amboseli weekend on short notice and the team sorted everything over WhatsApp within the day.',5),
('r2','David O.','Our driver-guide Joseph knew exactly where the herds would be each morning. Best safari we have done.',5),
('r3','Lena F.','Loved that we could pick our own stay and transport instead of a rigid package. Fair pricing too.',4);

-- Real admin account — password is admin123 (change it after first login).
-- Hash/salt below were generated with the exact PBKDF2-SHA256/100000-iteration scheme the Worker uses.
INSERT INTO users (id, name, email, phone, password_hash, password_salt, role, created_at)
VALUES ('admin1','Kelly Lemayian','kellylemayian6@gmail.com','0113556385',
  '324083ab4634da78385a2bd65b35d7006b441fa1b12f80e209c8d58fe45fafa0',
  '4e9adb6a6ee90c7e1650e5af5abbdac0',
  'admin', '2026-01-01T00:00:00.000Z')
ON CONFLICT(email) DO NOTHING;
