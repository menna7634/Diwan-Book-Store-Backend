const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

faker.locale = 'en';
faker.seed(123);

const NUM_USERS = 10;

async function seedUsers() {
  try {
    await User.deleteMany({});

    const users = [];

    for (let i = 0; i < NUM_USERS; i++) {
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();
      const email = faker.internet.email({
        firstName: firstname,
        lastName: lastname,
      });
      const password = await bcrypt.hash('Password123!', 12);

      users.push({
        firstname,
        lastname,
        dob: faker.date.birthdate({ min: 18, max: 40, mode: 'age' }),
        email,
        password,
        role: i === 0 ? 'admin' : 'user',
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
        },
      });
    }

    await User.insertMany(users);
    console.log('Users seeded!');
  } catch (err) {
    console.error('Seed failed:', err);
  }
}

module.exports = seedUsers;
