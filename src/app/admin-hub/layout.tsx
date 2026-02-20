import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionValid = cookieStore.get('adminToken')?.value;

    if (!sessionValid) {
        // Hidden mechanism for admin login would redirect or display a 404 here
        // We'll redirect to home for security
        redirect('/');
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4">
            <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                <h1 className="text-3xl font-extrabold text-primary">Admin Yönetim Paneli</h1>
                <p className="text-slate-500">Dernekler, ilanlar ve yetkiler</p>
            </header>
            {children}
        </div>
    );
}
