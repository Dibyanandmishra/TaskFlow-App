require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../modules/user/user.model');
const Task = require('../modules/task/task.model');
const logger = require('../utils/logger');

const ADMIN_DATA = {
  name: 'Admin User',
  email: 'admin@taskflow.com',
  password: 'Admin@123',
  role: 'admin',
};

const USER_DATA = {
  name: 'John Doe',
  email: 'john@taskflow.com',
  password: 'User@123',
  role: 'user',
};

const SAMPLE_TASKS = [
  { title: 'Set up project structure', description: 'Initialize Node.js project with Express', status: 'completed', priority: 'high' },
  { title: 'Design database schema', description: 'Create Mongoose models for User and Task', status: 'completed', priority: 'high' },
  { title: 'Implement authentication', description: 'JWT-based auth with register/login', status: 'in_progress', priority: 'high' },
  { title: 'Build task CRUD API', description: 'Create, read, update, delete tasks', status: 'pending', priority: 'medium' },
  { title: 'Add input validation', description: 'Joi validation on all endpoints', status: 'pending', priority: 'medium' },
  { title: 'Write API documentation', description: 'Swagger/OpenAPI spec', status: 'pending', priority: 'low' },
  { title: 'Set up Docker', description: 'Dockerfile and docker-compose.yml', status: 'pending', priority: 'low' },
  { title: 'Add rate limiting', description: 'Protect endpoints from abuse', status: 'pending', priority: 'medium' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding');

    await Promise.all([User.deleteMany({}), Task.deleteMany({})]);
    logger.info('Cleared existing data');

    const admin = await User.create(ADMIN_DATA);
    const user = await User.create(USER_DATA);
    logger.info(`Created admin: ${admin.email}`);
    logger.info(`Created user: ${user.email}`);

    const tasks = SAMPLE_TASKS.map((t) => ({ ...t, createdBy: user._id }));
    await Task.insertMany(tasks);
    logger.info(`Created ${tasks.length} sample tasks`);

    logger.info('--- Seed complete ---');
    logger.info(`Admin login: ${ADMIN_DATA.email} / ${ADMIN_DATA.password}`);
    logger.info(`User login:  ${USER_DATA.email} / ${USER_DATA.password}`);

    process.exit(0);
  } catch (err) {
    logger.error('Seed failed:', { error: err.message });
    process.exit(1);
  }
};

seed();
