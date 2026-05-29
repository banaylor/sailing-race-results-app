import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.raceEntry.deleteMany();
  await prisma.race.deleteMany();
  await prisma.boat.deleteMany();
  await prisma.user.deleteMany();
  await prisma.club.deleteMany();

  // Create Clubs
  console.log('🏛️  Creating clubs...');
  const club1 = await prisma.club.create({
    data: {
      name: 'Riverside Sailing Club',
      location: 'Thames River, London',
      timezone: 'Europe/London',
    },
  });

  const club2 = await prisma.club.create({
    data: {
      name: 'Coastal Yacht Club',
      location: 'Brighton Marina',
      timezone: 'Europe/London',
    },
  });

  const club3 = await prisma.club.create({
    data: {
      name: 'Lake District Sailing Club',
      location: 'Windermere, Cumbria',
      timezone: 'Europe/London',
    },
  });

  console.log(`✅ Created ${3} clubs`);

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@sailing.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+44 20 1234 5678',
      role: 'club_admin',
      clubId: club1.id,
    },
  });

  const raceOfficer = await prisma.user.create({
    data: {
      email: 'officer@sailing.com',
      password: hashedPassword,
      firstName: 'Race',
      lastName: 'Officer',
      phone: '+44 20 1234 5679',
      role: 'race_officer',
      clubId: club1.id,
    },
  });

  const sailor1 = await prisma.user.create({
    data: {
      email: 'john.sailor@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Sailor',
      phone: '+44 20 1234 5680',
      role: 'sailor',
      clubId: club1.id,
    },
  });

  const sailor2 = await prisma.user.create({
    data: {
      email: 'sarah.wave@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Wave',
      phone: '+44 20 1234 5681',
      role: 'sailor',
      clubId: club1.id,
    },
  });

  const sailor3 = await prisma.user.create({
    data: {
      email: 'mike.wind@example.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Wind',
      phone: '+44 20 1234 5682',
      role: 'sailor',
      clubId: club2.id,
    },
  });

  const sailor4 = await prisma.user.create({
    data: {
      email: 'emma.tide@example.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Tide',
      phone: '+44 20 1234 5683',
      role: 'sailor',
      clubId: club2.id,
    },
  });

  const sailor5 = await prisma.user.create({
    data: {
      email: 'david.helm@example.com',
      password: hashedPassword,
      firstName: 'David',
      lastName: 'Helm',
      phone: '+44 20 1234 5684',
      role: 'sailor',
      clubId: club3.id,
    },
  });

  console.log(`✅ Created ${7} users (password for all: Password123!)`);

  // Create Boats
  console.log('⛵ Creating boats...');
  const boat1 = await prisma.boat.create({
    data: {
      ownerId: sailor1.id,
      name: 'Sea Breeze',
      sailNumber: 'GBR-1234',
      boatClass: 'Laser',
      pyNumber: 1100,
    },
  });

  const boat2 = await prisma.boat.create({
    data: {
      ownerId: sailor2.id,
      name: 'Wind Dancer',
      sailNumber: 'GBR-5678',
      boatClass: 'RS Aero 7',
      pyNumber: 1065,
    },
  });

  const boat3 = await prisma.boat.create({
    data: {
      ownerId: sailor3.id,
      name: 'Wave Rider',
      sailNumber: 'GBR-9012',
      boatClass: '420',
      pyNumber: 1105,
    },
  });

  const boat4 = await prisma.boat.create({
    data: {
      ownerId: sailor4.id,
      name: 'Storm Chaser',
      sailNumber: 'GBR-3456',
      boatClass: 'Laser',
      pyNumber: 1100,
    },
  });

  const boat5 = await prisma.boat.create({
    data: {
      ownerId: sailor5.id,
      name: 'Blue Horizon',
      sailNumber: 'GBR-7890',
      boatClass: 'Topper',
      pyNumber: 1365,
    },
  });

  const boat6 = await prisma.boat.create({
    data: {
      ownerId: sailor1.id,
      name: 'Lightning',
      sailNumber: 'GBR-2468',
      boatClass: 'RS Aero 9',
      pyNumber: 1014,
    },
  });

  console.log(`✅ Created ${6} boats`);

  // Create Races
  console.log('🏁 Creating races...');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const race1 = await prisma.race.create({
    data: {
      clubId: club1.id,
      name: 'Spring Series - Race 1',
      raceDate: lastWeek,
      startTime: new Date('2024-01-01T14:00:00Z'),
      status: 'completed',
      createdBy: raceOfficer.id,
    },
  });

  const race2 = await prisma.race.create({
    data: {
      clubId: club1.id,
      name: 'Spring Series - Race 2',
      raceDate: yesterday,
      startTime: new Date('2024-01-01T14:00:00Z'),
      status: 'completed',
      createdBy: raceOfficer.id,
    },
  });

  const race3 = await prisma.race.create({
    data: {
      clubId: club1.id,
      name: 'Spring Series - Race 3',
      raceDate: today,
      startTime: new Date('2024-01-01T14:00:00Z'),
      status: 'scheduled',
      createdBy: raceOfficer.id,
    },
  });

  const race4 = await prisma.race.create({
    data: {
      clubId: club2.id,
      name: 'Coastal Challenge',
      raceDate: nextWeek,
      startTime: new Date('2024-01-01T10:00:00Z'),
      status: 'scheduled',
      createdBy: admin.id,
    },
  });

  const race5 = await prisma.race.create({
    data: {
      clubId: club3.id,
      name: 'Lake District Regatta',
      raceDate: nextWeek,
      startTime: new Date('2024-01-01T11:00:00Z'),
      status: 'scheduled',
      createdBy: admin.id,
    },
  });

  console.log(`✅ Created ${5} races`);

  // Create Race Entries for completed races
  console.log('📝 Creating race entries...');

  // Race 1 entries (completed)
  await prisma.raceEntry.create({
    data: {
      raceId: race1.id,
      userId: sailor1.id,
      boatId: boat1.id,
      status: 'finished',
      finishTime: '01:23:45',
      correctedTime: '01:16:12',
      position: 1,
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race1.id,
      userId: sailor2.id,
      boatId: boat2.id,
      status: 'finished',
      finishTime: '01:25:30',
      correctedTime: '01:20:15',
      position: 2,
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race1.id,
      userId: sailor4.id,
      boatId: boat4.id,
      status: 'finished',
      finishTime: '01:28:15',
      correctedTime: '01:21:03',
      position: 3,
    },
  });

  // Race 2 entries (completed)
  await prisma.raceEntry.create({
    data: {
      raceId: race2.id,
      userId: sailor2.id,
      boatId: boat2.id,
      status: 'finished',
      finishTime: '01:22:10',
      correctedTime: '01:17:05',
      position: 1,
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race2.id,
      userId: sailor1.id,
      boatId: boat1.id,
      status: 'finished',
      finishTime: '01:24:30',
      correctedTime: '01:17:18',
      position: 2,
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race2.id,
      userId: sailor4.id,
      boatId: boat4.id,
      status: 'dnf',
      position: null,
    },
  });

  // Race 3 entries (scheduled - registered only)
  await prisma.raceEntry.create({
    data: {
      raceId: race3.id,
      userId: sailor1.id,
      boatId: boat1.id,
      status: 'registered',
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race3.id,
      userId: sailor2.id,
      boatId: boat2.id,
      status: 'registered',
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race3.id,
      userId: sailor4.id,
      boatId: boat4.id,
      status: 'registered',
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race3.id,
      userId: sailor1.id,
      boatId: boat6.id,
      status: 'registered',
    },
  });

  // Race 4 entries (scheduled)
  await prisma.raceEntry.create({
    data: {
      raceId: race4.id,
      userId: sailor3.id,
      boatId: boat3.id,
      status: 'registered',
    },
  });

  await prisma.raceEntry.create({
    data: {
      raceId: race4.id,
      userId: sailor4.id,
      boatId: boat4.id,
      status: 'registered',
    },
  });

  console.log(`✅ Created ${11} race entries`);

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${3} clubs`);
  console.log(`   - ${7} users`);
  console.log(`   - ${6} boats`);
  console.log(`   - ${5} races`);
  console.log(`   - ${11} race entries`);
  console.log('\n🔐 Test Credentials (all users):');
  console.log('   Password: Password123!');
  console.log('\n👤 Test Users:');
  console.log('   - admin@sailing.com (Club Admin)');
  console.log('   - officer@sailing.com (Race Officer)');
  console.log('   - john.sailor@example.com (Sailor)');
  console.log('   - sarah.wave@example.com (Sailor)');
  console.log('   - mike.wind@example.com (Sailor)');
  console.log('   - emma.tide@example.com (Sailor)');
  console.log('   - david.helm@example.com (Sailor)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Made with Bob
