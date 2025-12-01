import { db } from '../src/lib/server/db/index';
import { user } from '../src/lib/server/db/schema';

async function main() {
    try {
        const users = await db.select().from(user).all();
        console.log('Database connection successful.');
        console.log('Users found:', users.length);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

main();
