import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, email, advice } = body || {};

        if (!id || !email || typeof advice === 'undefined') {
            return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
        }

        const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyRZatqlCOsahNjMxiRYmsGLQ-FFnicAKpuSuyAUSh383Eyb_t55W-SPuhNaslGZ4qL/exec';

        const payload = { id, email, advice };
        const url = `${scriptUrl}?action=insert&table=advice&data=${encodeURIComponent(JSON.stringify(payload))}`;
        const upstream = await fetch(url, { method: 'GET', cache: 'no-store' });

        let data;
        const text = await upstream.text();
        try {
            data = JSON.parse(text);
        } catch (_) {
            data = text;
        }

        return NextResponse.json({ ok: true, data });
    } catch (e) {
        return NextResponse.json({ ok: false, error: `${e}` }, { status: 500 });
    }
}


