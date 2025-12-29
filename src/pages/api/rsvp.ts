import type { APIRoute } from 'astro';

interface RSVPData {
    name: string;
    attending: string;
    guests: number;
}

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const data: RSVPData = await request.json();

        // Validate input
        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!['Yes', 'No'].includes(data.attending)) {
            return new Response(JSON.stringify({ error: 'Invalid attending value' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const guests = data.attending === 'Yes' ? Math.max(0, Math.min(9, Number(data.guests) || 0)) : 0;

        // Get D1 database from runtime
        const runtime = locals.runtime;
        const db = runtime?.env?.DB;

        if (db) {
            // Insert into D1 database
            const ipHash = request.headers.get('cf-connecting-ip')
                ? await hashIP(request.headers.get('cf-connecting-ip')!)
                : null;
            const userAgent = request.headers.get('user-agent')?.substring(0, 255);

            await db.prepare(`
                INSERT INTO rsvp_responses (name, attending, guests, ip_hash, user_agent)
                VALUES (?, ?, ?, ?, ?)
            `).bind(
                data.name.trim(),
                data.attending,
                guests,
                ipHash,
                userAgent
            ).run();
        } else {
            // Fallback: Log to console (for development or if D1 not configured)
            console.log('RSVP Submission:', {
                name: data.name.trim(),
                attending: data.attending,
                guests,
                timestamp: new Date().toISOString()
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('RSVP submission error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Handle preflight requests
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
};

// Simple hash function for IP privacy
async function hashIP(ip: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + 'wedding-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
