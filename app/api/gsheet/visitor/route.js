import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const forwardedFor = request.headers.get('x-forwarded-for') || '';
        const realIp = request.headers.get('x-real-ip') || '';
        const clientIp = (forwardedFor.split(',')[0] || realIp || '').trim() || 'unknown';

        const payload = {
            id: body.id,
            landingUrl: body.landingUrl,
            ip: clientIp,
            time_stamp: body.time_stamp,
            utm: body.utm || '',
            device: body.device || 'desktop'
        };

        const scriptUrl = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyRZatqlCOsahNjMxiRYmsGLQ-FFnicAKpuSuyAUSh383Eyb_t55W-SPuhNaslGZ4qL/exec';

        const url = `${scriptUrl}?action=insert&table=visitor_landing&data=${encodeURIComponent(JSON.stringify(payload))}`;
        const upstream = await fetch(url, { method: 'GET', cache: 'no-store' });

        // Apps Script may return JSON or JSONP; try JSON first
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


