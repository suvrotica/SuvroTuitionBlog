import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import { google } from '$lib/server/oauth';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = cookies.get('google_oauth_state') ?? null;
    const storedCodeVerifier = cookies.get('google_oauth_code_verifier') ?? null;

    if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
        const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`
            }
        });
        const googleUser: GoogleUser = await googleUserResponse.json();

        // Check if user exists
        const existingUser = await db.select().from(user).where(eq(user.googleId, googleUser.sub)).get();

        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies.set(sessionCookie.name, sessionCookie.value, {
                path: '.',
                ...sessionCookie.attributes
            });
        } else {
            const userId = generateIdFromEntropySize(10); // 16 characters long

            await db.insert(user).values({
                id: userId,
                googleId: googleUser.sub,
                username: googleUser.name,
                avatarUrl: googleUser.picture
            });

            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies.set(sessionCookie.name, sessionCookie.value, {
                path: '.',
                ...sessionCookie.attributes
            });
        }
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/'
            }
        });
    } catch (e) {
        console.error('Google OAuth Callback Error:', e);
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }
};

interface GoogleUser {
    sub: string;
    name: string;
    picture: string;
}
