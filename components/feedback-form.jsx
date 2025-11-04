'use client';

import { useState } from 'react';
import { Alert } from './alert';
import { Card } from './card';

export function FeedbackForm() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [advice, setAdvice] = useState('');

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            const id = (() => {
                const value = `; ${document.cookie}`;
                const parts = value.split('; user=');
                if (parts.length === 2) return parts.pop().split(';').shift();
                return '';
            })();
            const res = await fetch('/api/gsheet/advice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, email, advice })
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j.error || `${res.status} ${res.statusText}`);
            }
            setStatus('ok');
            setEmail('');
            setAdvice('');
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };

    return (
        <div className="w-full md:max-w-md">
            <Card title="사전 신청">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 align-center">
                    <input
                        name="email"
                        type="email"
                        placeholder="알림을 받으실 이메일"
                        required
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <textarea
                        name="advice"
                        placeholder="서비스에 대한 조언을 남겨주세요"
                        className="input"
                        rows={5}
                        value={advice}
                        onChange={(e) => setAdvice(e.target.value)}
                    />
                    <button className="btn" type="submit" disabled={status === 'pending'}>
                        지금 제출!
                    </button>
                    {status === 'ok' && <Alert type="success">제출되었습니다. 감사합니다!</Alert>}
                    {status === 'error' && <Alert type="error">{error}</Alert>}
                </form>
            </Card>
        </div>
    );
}
