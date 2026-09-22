require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Settings = require('./models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infoverse';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@infoverse.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

// ============================================================
// Event seed data
// ============================================================
const eventsData = [
  // --- TECHNICAL ---
  {
    name: 'Paper Preparation',
    category: 'Technical',
    description:
      'Present your research paper on cutting-edge technology topics. Submit your PPT/PDF and present to our panel of judges.',
    rules: [
      'Exactly 3 members per team',
      'Topic must be relevant to current technology trends',
      'Presentation format: PPT/PPTX/PDF only',
      'Maximum 10 slides',
      'Time limit: 8 min presentation + 2 min Q&A',
      'Submit files before the event deadline',
      'Plagiarism leads to immediate disqualification',
    ],
    teamSize: { min: 3, max: 3 },
    mode: 'Online',
    fee: 600,
    date: '09/10/2026',
    venue: 'Online (Google Meet link will be shared)',
    isTeamEvent: true,
    requiresUpload: true,
    status: 'active',
  },
  {
    name: 'Prompt Battle',
    category: 'Technical',
    description:
      'Test your creativity with AI! Craft the best prompts to get stunning outputs from AI tools. Compete against other participants in this battle of words and wit.',
    rules: [
      'Individual participation only',
      'Participants will be provided AI tools on the spot',
      'Best prompt judged on creativity and AI output quality',
      'No pre-prepared prompts allowed',
      'Internet will be restricted — only approved AI tools available',
      'Judge decision is final',
    ],
    teamSize: { min: 1, max: 1 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Lab 1, DMI Engineering College',
    isTeamEvent: false,
    requiresUpload: false,
    status: 'active',
  },
  {
    name: 'Debugging',
    category: 'Technical',
    description:
      'Find and fix bugs in code snippets across multiple programming languages. Test your debugging skills under time pressure.',
    rules: [
      'Individual participation',
      'Buggy code provided in Python, Java, C, and C++',
      'Time limit: 45 minutes',
      'Partial marks awarded for partial fixes',
      'No external help, internet, or phones allowed',
      'Score based on number of bugs fixed',
    ],
    teamSize: { min: 1, max: 1 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Lab 2, DMI Engineering College',
    isTeamEvent: false,
    requiresUpload: false,
    status: 'active',
  },
  {
    name: 'Project Expo',
    category: 'Technical',
    description:
      'Showcase your innovative projects to industry experts and faculty judges. Demo your working prototype and explain your vision.',
    rules: [
      'Team size: 2 to 4 members',
      'Must present a working prototype or demo',
      'Judged on innovation, feasibility, design, and presentation',
      'Project must be original and not submitted elsewhere',
      'Abstract/report submission required before event',
      'Setup time: 30 minutes before judging',
    ],
    teamSize: { min: 2, max: 4 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Seminar Hall, DMI Engineering College',
    isTeamEvent: true,
    requiresUpload: false,
    status: 'active',
  },
  {
    name: 'Website Creation',
    category: 'Technical',
    description:
      'Design and build a fully functional website within the time limit. Show off your frontend skills, creativity, and speed coding ability.',
    rules: [
      'Individual or team of 2',
      'Theme announced on the spot',
      'Time limit: 2 hours',
      'Any framework or plain HTML/CSS/JS allowed',
      'Judged on UI/UX, functionality, and code quality',
      'No pre-built templates or copied code allowed',
    ],
    teamSize: { min: 1, max: 2 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Lab 3, DMI Engineering College',
    isTeamEvent: false,
    requiresUpload: false,
    status: 'active',
  },

  // --- NON-TECHNICAL ---
  {
    name: 'Memes Creation',
    category: 'Non-Technical',
    description:
      'Create hilarious tech-themed memes! Show your humor and creativity with technology-related meme content.',
    rules: [
      'Individual participation',
      'Create original memes on given tech topics',
      'Submit in JPG or PNG format',
      'No offensive or inappropriate content allowed',
      'Maximum 3 meme submissions per participant',
      'Judged on creativity, relevance, and humor',
    ],
    teamSize: { min: 1, max: 1 },
    mode: 'Online',
    fee: 200,
    date: '09/10/2026',
    venue: 'Online (WhatsApp group will be shared)',
    isTeamEvent: false,
    requiresUpload: false,
    status: 'active',
  },
  {
    name: 'Quiz',
    category: 'Non-Technical',
    description:
      'Test your knowledge across general IT, current tech affairs, and trivia. Multiple exciting rounds await!',
    rules: [
      'Individual participation',
      'Rounds: General IT, Current Affairs, Tech Trivia, Rapid Fire',
      'No phones or electronic devices allowed',
      'Tie-breaker round if scores are equal',
      'Moderator decision is final',
      'No negative marking in preliminary rounds',
    ],
    teamSize: { min: 1, max: 1 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Seminar Hall, DMI Engineering College',
    isTeamEvent: false,
    requiresUpload: false,
    status: 'active',
  },
  {
    name: 'Imposter',
    category: 'Non-Technical',
    description:
      'Inspired by Among Us! Identify the imposters among your team through tech-related tasks and social deduction.',
    rules: [
      'Team of 5 to 7 members',
      'Imposters are secretly assigned at game start',
      'Rounds involve completing tech tasks',
      'Vote out suspected imposters in discussion rounds',
      'Game ends when imposters are found or outnumber crew',
      'Moderator facilitates all rounds',
    ],
    teamSize: { min: 5, max: 7 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Activity Hall, DMI Engineering College',
    isTeamEvent: true,
    requiresUpload: false,
    status: 'active',
  },
  {
    name: 'Finding BGM',
    category: 'Non-Technical',
    description:
      'Identify background music from popular movies, TV shows, and games. Test your musical memory across genres!',
    rules: [
      'Individual participation',
      'Identify BGM from movies, shows, anime, and games',
      'Multiple rounds with increasing difficulty',
      'No mobile phones allowed during contest',
      'First correct answer wins the round',
      'Final ranking based on total points collected',
    ],
    teamSize: { min: 1, max: 1 },
    mode: 'Offline',
    fee: 200,
    date: '09/10/2026',
    venue: 'Seminar Hall, DMI Engineering College',
    isTeamEvent: false,
    requiresUpload: false,
    status: 'active',
  },
];

// ============================================================
// Default Settings
// ============================================================
const defaultSettings = {
  symposiumName: 'INFOVERSE 2026',
  college: 'DMI Engineering College',
  department: 'Department of Computer Science and Engineering',
  date: '09/10/2026',
  time: '09:00 AM',
  venue: 'DMI Engineering College, Pallapatti',
  normalFee: 200,
  paperFee: 600,
  referralDiscount: 10,
  upiId: 'infoverse@upi',
  qrImage: '',
  contactEmail: 'infoverse@dmi.ac.in',
  contactPhone: '+91 9876543210',
};

// ============================================================
// Seed runner
// ============================================================
const seed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected.\n');

    // ---- 1. Create/update admin user ----
    console.log('👤 Seeding admin user...');
    let adminUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

   if (!adminUser) {
  adminUser = new User({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  await adminUser.save({ validateBeforeSave: false });

  console.log(`   ✅ Admin user created: ${ADMIN_EMAIL}`);
} else {
  // Update role to admin and reset password
  adminUser.role = 'admin';
  adminUser.password = ADMIN_PASSWORD;

  await adminUser.save({ validateBeforeSave: false });

  console.log(`   ♻️  Admin user updated: ${ADMIN_EMAIL}`);
}

    // ---- 2. Upsert default Settings ----
    console.log('\n⚙️  Seeding settings...');
    let settings = await Settings.findOne();
    if (!settings) {
      await Settings.create(defaultSettings);
      console.log('   ✅ Default settings created.');
    } else {
      console.log('   ℹ️  Settings already exist. Skipping.');
    }

    // ---- 3. Seed events ----
    console.log('\n🎉 Seeding events...');
    let created = 0;
    let skipped = 0;

    for (const eventData of eventsData) {
      const existing = await Event.findOne({ name: eventData.name });
      if (existing) {
        console.log(`   ⏭️  Skipped (already exists): ${eventData.name}`);
        skipped++;
      } else {
        await Event.create(eventData);
        console.log(`   ✅ Created event: ${eventData.name} (${eventData.category})`);
        created++;
      }
    }

    console.log(`\n📊 Events summary: ${created} created, ${skipped} skipped.\n`);
    console.log('🎉 Database seeding completed successfully!\n');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    console.error(err);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seed();
