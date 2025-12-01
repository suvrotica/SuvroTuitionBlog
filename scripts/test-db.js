import { db } from '../src/lib/server/db/index.js';
import { user } from '../src/lib/server/db/schema.js';

try {
    const users = db.select().from(user).all();
    console.log('Database connection successful.');
    console.log('Users found:', users.length);
} catch (error) {
    console.error('Database connection failed:', error);
}
