-- =====================================================================
-- Seed data: real repos from github.com/Tejastarle + CV content.
-- Run AFTER schema.sql. Re-runnable (upserts on slug).
-- =====================================================================

insert into public.projects
  (slug, title, tagline, category, stack, repo_url, language, featured, year, sort_order)
values
  ('merkmetryx','Merkmetryx','Market-research and analytics platform. Three payment gateways normalised behind one gateway-agnostic interface, with a survey ingestion pipeline and automated executive reporting.','enterprise',
   '{ReactJS,Node.js,Express,MongoDB,Razorpay,Stripe,PayPal}',null,'TypeScript',true,2026,0),
  ('ecokart','EcoKart','Full-stack e-commerce platform. Idempotent order handling and webhook-driven payment status updates keep charges and order state in sync.','web',
   '{ReactJS,Node.js,Express,MongoDB,Payments}','https://github.com/Tejastarle/EcoKart','TypeScript',true,2026,1),
  ('apex-crm','Apex CRM','Freelance CRM backend delivered end to end — lead pipeline, customer records, role-based dashboards and activity-tracking APIs.','enterprise',
   '{Node.js,Express,MongoDB,REST}','https://github.com/Tejastarle/Apex-CRM','JavaScript',true,2026,2),
  ('doortodoor-marketing','DoorToDoor Marketing','Field-campaign tracking and lead capture.','enterprise',
   '{TypeScript,React}','https://github.com/Tejastarle/doortodoor-marketing','TypeScript',true,2026,3),
  ('daddus-biryani','Daddus Biryani','Restaurant ordering site, menu to checkout.','web',
   '{TypeScript,React}','https://github.com/Tejastarle/daddus-biryani-complete','TypeScript',true,2026,4),
  ('women-safety-app','Women Safety App','Real-time safety app with SOS alerting and live GPS tracking. Published in IJARIIE, Volume 11, 2025.','android',
   '{Java,Firebase,GPS}','https://github.com/Tejastarle/WomenSafetyApp','Java',true,2025,5),
  ('sparkwomen','SparkWomen','Emergency-response companion app.','android',
   '{Java,Firebase}','https://github.com/Tejastarle/SparkWomen','Java',true,2025,6),
  ('smart-city','Smart City','Civic services and reporting interface.','web',
   '{HTML,CSS,JavaScript}','https://github.com/Tejastarle/smart-city','HTML',false,2026,7),
  ('project-management','Project Management','Sprint boards, task assignment, delivery tracking.','enterprise',
   '{JavaScript,Node.js}','https://github.com/Tejastarle/Project_Management-master','JavaScript',true,2025,8),
  ('plantbio-dictionary','PlantBio Dictionary','Plant identification and reference platform.','android',
   '{Java,Android}','https://github.com/Tejastarle/PlantBioDictionary','Java',false,2025,9),
  ('baoiam-app','Baoiam App','Learning app built with Jetpack Compose.','android',
   '{Kotlin,"Jetpack Compose"}','https://github.com/Tejastarle/BaoiamApp','Kotlin',false,2024,10),
  ('baoiam-official','Baoiam Official','Cross-platform client build in Flutter.','android',
   '{Dart,Flutter}','https://github.com/Tejastarle/Baoiam_Official-main','Dart',false,2024,11),
  ('infinity','Infinity','Motion-led marketing site.','web',
   '{CSS,JavaScript}','https://github.com/Tejastarle/infinity-','CSS',false,2025,12),
  ('expenditure-app','Expenditure App','Personal spend tracking on Android.','android',
   '{Java,SQLite}','https://github.com/Tejastarle/expenditure_app','Java',false,2024,13),
  ('notes-taker','Notes Taker','Offline-first note capture.','android',
   '{Java,Room}','https://github.com/Tejastarle/NOTES_TAKER_1','Java',false,2024,14),
  ('app-drawer','App Drawer','Intent passing and navigation patterns reference.','android',
   '{Java,Android}','https://github.com/Tejastarle/app_drawer','Java',false,2025,15),
  ('todolist-app','ToDoList App','Task manager with persistent storage.','android',
   '{Java,Android}','https://github.com/Tejastarle/ToDoList_App','Java',false,2024,16),
  ('old-accessories-drawer','Old Accessories Drawer','Resale listings marketplace.','web',
   '{JavaScript}','https://github.com/Tejastarle/Old_Accessories_Drawer','JavaScript',false,2024,17),
  ('my-loginpage','Login Page','Auth screen with validation states.','android',
   '{Java,Android}','https://github.com/Tejastarle/my_loginpage','Java',false,2025,18)
on conflict (slug) do update set
  tagline = excluded.tagline,
  category = excluded.category,
  stack = excluded.stack,
  repo_url = excluded.repo_url;

insert into public.experience (role, company, location, employment_type, start_date, end_date, highlights, sort_order)
values
  ('Vice President & Program Manager','Agix International Pvt. Ltd.','Remote, India','Full-Time','2025-12-01',null,
   array[
     'Build and ship backend services for the Agix corporate platform and internal tooling in Node.js, Express and MongoDB — REST API design, authentication, role-based access control and deployment pipelines.',
     'Translate ambiguous business requirements into concrete API contracts and technical specifications across ReactJS, Node.js, Firebase, Flutter and LLM tooling.',
     'Build market-research dashboards, analytics platforms and automated reporting services used for executive decision-making.',
     'Own the delivery lifecycle for 15+ enterprise and SME clients: scoping, architecture, sprint planning, release and sign-off; maintain 95% on-time delivery with no escalation leakage.',
     'Introduce CI/CD pipelines and SOP documentation, cutting manual release and handover effort by roughly 30%.'
   ],1),
  ('Full-Stack Developer & Team Lead','Apex Infinity Tech','Nashik, India','Full-Time','2025-05-01','2025-12-01',
   array[
     'Joined as a full-stack intern and was promoted to corporate trainer, then team leader, within 90 days.',
     'Delivered five live client projects as the primary developer — React front ends, Node.js and Express APIs, and MongoDB data models.',
     'Led a small delivery team through code review, sprint stand-ups and performance reviews; team KPI achievement improved 40% over the period.',
     'Designed and ran internal training on engineering communication, code quality and client negotiation for 30+ associates.'
   ],2),
  ('Android Development Trainer','Lokare''s Infotech','India','Part-Time','2024-11-01','2025-03-01',
   array[
     'Taught 200+ students across multiple batches in Android fundamentals, app architecture and Play Store deployment using Java, XML and Android Studio.',
     'Ran debugging sessions and walked students through production release workflows.'
   ],3),
  ('Android Developer Intern & Development Lead','Baoiam Innovations','India','Internship','2024-07-01','2024-10-01',
   array[
     'Development lead on a production Android application; designed and implemented every component end to end, from screen architecture to backend API contracts.',
     'Owned the full payment gateway integration (Razorpay and Stripe): checkout flow, server-side order creation, signature verification, callback handling and failure/retry logic.',
     'Implemented OAuth and OTP authentication including token refresh and session management.',
     'Integrated Firebase Realtime Database and Cloud Messaging for live data sync, push notifications and in-app analytics.',
     'Rebuilt the UI to Material Design standards, reducing reported UX defects by 25%.'
   ],4),
  ('Web Developer Intern & Team Lead','Faith Group','India','Internship','2023-11-01','2024-03-01',
   array[
     'Primary developer across multiple client projects, building and maintaining full-stack web and mobile applications end to end.',
     'Configured and operated 10+ live client websites: hosting, DNS and domain setup, server provisioning, SSL, and production deployments on Linux with post-launch debugging.'
   ],5);

insert into public.certifications (name, issuer, year, sort_order) values
  ('Oracle Certified Foundations Associate','Oracle',2024,1),
  ('Cognizant AI Job Simulation','Cognizant / Forage',2024,2),
  ('AICTE Android Developer Internship Certification','AICTE',2024,3),
  ('TATA Data Visualisation Program','Tata Group / Forage',2024,4),
  ('TCS iON Business Communication Skills','TCS iON',2023,5);
