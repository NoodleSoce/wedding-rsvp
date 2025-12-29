import type { APIRoute } from 'astro';

interface RSVPData {
    name: string;
    attending: string;
    guests: number;
}

// Your existing Google Apps Script URL for spreadsheet sync
const GOOGLE_SHEETS_API = "https://script.google.com/macros/s/AKfycbwq4PjP3sAEj2YTMTge5tZkwDx447v4T-0ySATyf3GImmpnZTaop-NGoxFj-lSyGnTl/exec";

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
        const trimmedName = data.name.trim();

        // Get D1 database from runtime
        const runtime = locals.runtime;
        const db = runtime?.env?.DB;

        // Track results
        let d1Success = false;
        let sheetsSuccess = false;

        // 1. Save to D1 Database (primary storage)
        if (db) {
            try {
                const ipHash = request.headers.get('cf-connecting-ip')
                    ? await hashIP(request.headers.get('cf-connecting-ip')!)
                    : null;
                const userAgent = request.headers.get('user-agent')?.substring(0, 255);

                await db.prepare(`
                    INSERT INTO rsvp_responses (name, attending, guests, ip_hash, user_agent)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(
                    trimmedName,
                    data.attending,
                    guests,
                    ipHash,
                    userAgent
                ).run();

                d1Success = true;
            } catch (dbError) {
                console.error('D1 database error:', dbError);
            }
        }

        // 2. Sync to Google Sheets (backup/viewing convenience)
        try {
            const sheetsPayload = {
                name: trimmedName,
                attending: data.attending,
                guests: guests,
                timestamp: new Date().toISOString()
            };

            // Fire and don't wait (non-blocking sync)
            await fetch(GOOGLE_SHEETS_API, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheetsPayload),
            });

            sheetsSuccess = true;
        } catch (sheetsError) {
            console.error('Google Sheets sync error:', sheetsError);
        }

        // At least one storage method should succeed
        if (!d1Success && !sheetsSuccess) {
            return new Response(JSON.stringify({ error: 'Failed to save RSVP' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            storage: {
                d1: d1Success,
                sheets: sheetsSuccess
            }
        }), {
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
