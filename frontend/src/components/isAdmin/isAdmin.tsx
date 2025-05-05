'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export function isAdminWithRedirect() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const adminStatus = isAdminFunc();
            setIsAdmin(adminStatus);

            if (!adminStatus) {
                router.push('/');
            }

            setIsCheckingAuth(false);
        }
    }, [router]);

    return {isAdmin, isCheckingAuth};
}

export function isAdminFunc() {
    if (typeof window === 'undefined') {
        return false;
    }
    return (
        localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superadmin'
    );
}

export function isSuperAdminFunc() {
    if (typeof window === 'undefined') {
        return false;
    }
    return localStorage.getItem('role') === 'superadmin';
}
