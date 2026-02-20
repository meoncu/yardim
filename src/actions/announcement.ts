"use server";

import { adminDb } from '@/lib/firebase-admin/config';
import { Announcement } from '@/types';
import { revalidatePath } from 'next/cache';

export async function submitAnnouncement(data: Partial<Announcement>) {
    // In a real scenario, you would verify the admin session cookie here as well
    // await verifyAdminSession();

    if (!data.id) {
        // Generate new doc if creating
        const ref = adminDb.collection("announcements").doc();
        const newDoc: Announcement = {
            ...data,
            id: ref.id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            randomWeight: Math.floor(Math.random() * 1000), // Random distribution weight
        } as Announcement;
        await ref.set(newDoc);
    } else {
        // Updating existing
        await adminDb.collection("announcements").doc(data.id).update({
            ...data,
            updatedAt: Date.now(),
        });
    }

    // Clear Next.js cache so the new content acts instantly
    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true };
}

export async function deleteAnnouncement(id: string) {
    // verifyAdminSession();
    await adminDb.collection("announcements").doc(id).delete();
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
}
