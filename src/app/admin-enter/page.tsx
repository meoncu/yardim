"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            // Call internal API to set secure HTTP-only cookie
            const res = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            if (res.ok) {
                window.location.href = '/admin-hub';
            } else {
                alert("Yetkisiz giriş denemesi.");
                await auth.signOut();
            }
        } catch (error) {
            console.error(error);
            alert("Giriş hatası!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="p-8 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Yönetici Girişi</h2>
                <p className="text-slate-500 mb-8 text-sm">Sadece yetkili Google hesapları erişebilir.</p>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                    {loading ? 'Bağlanıyor...' : 'Google ile Giriş Yap'}
                </button>
            </div>
        </div>
    );
}
