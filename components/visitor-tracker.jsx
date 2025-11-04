'use client';

import { useEffect } from 'react';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

function getOrCreateUserId() {
    const existing = getCookie('user');
    if (existing) return existing;
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCookie('user', id, 180);
    return id;
}

function pad(value) {
    return value < 10 ? `0${value}` : `${value}`;
}

function getTimestamp() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function isMobile() {
    if (typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function VisitorTracker() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (sessionStorage.getItem('visitorLogged') === '1') return;
        sessionStorage.setItem('visitorLogged', '1');

        const id = getOrCreateUserId();
        const landingUrl = window.location.href;
        const ts = getTimestamp();
        const params = new URLSearchParams(window.location.search);
        const utm = params.get('utm') || '';
        const device = isMobile() ? 'mobile' : 'desktop';

        fetch('/api/gsheet/visitor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, landingUrl, time_stamp: ts, utm, device })
        }).catch(() => {});
    }, []);

    return null;
}


