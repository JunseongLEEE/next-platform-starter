'use client';

import { useState } from 'react';
import { Alert } from './alert';
import { Card } from './card';

export function FeedbackForm() {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setStatus('pending');
            setError(null);
            const myForm = event.target;
            const formData = new FormData(myForm);
            const res = await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            if (res.status === 200) {
                setStatus('ok');
            } else {
                setStatus('error');
                setError(`${res.status} ${res.statusText}`);
            }
        } catch (e) {
            setStatus('error');
            setError(`${e}`);
        }
    };

    return (
        <div className="w-full md:max-w-md">
            <Card title="사전 신청">
                <form name="contact" onSubmit={handleFormSubmit} className="flex flex-col gap-3 align-center">
                    <input type="hidden" name="form-name" value="contact" />
                    <input name="email" type="email" placeholder="이메일 주소" required className="input" />
                    <button className="btn" type="submit" disabled={status === 'pending'}>
                        사전 신청
                    </button>
                    {status === 'ok' && <Alert type="success">제출되었습니다. 감사합니다!</Alert>}
                    {status === 'error' && <Alert type="error">{error}</Alert>}
                </form>
            </Card>
        </div>
    );
}
