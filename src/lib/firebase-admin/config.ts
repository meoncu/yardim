import * as admin from 'firebase-admin';

// Protect this environment variable at the Vercel level!
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

export function getAdminApp() {
    if (!admin.apps.length) {
        if (!serviceAccountKey) {
            console.warn('Firebase Service Account Key is missing.');
            // For fallback or local init if env not provided:
            // admin.initializeApp();
            return admin.initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            });
        }

        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } catch (error) {
            console.error('Firebase Admin initialization error', error);
            // Fallback
            admin.initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            });
        }
    }
    return admin.app();
}

export const adminDb = getAdminApp().firestore();
export const adminAuth = getAdminApp().auth();
