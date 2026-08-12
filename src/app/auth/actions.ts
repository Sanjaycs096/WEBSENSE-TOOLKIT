'use client';

// This file is now primarily for utility functions that can run on the server or client.
// The main server actions for login/signup have been moved to client-side handlers.

export function getFirebaseAuthErrorMessage(error: any): string {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already in use by another account.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/weak-password':
            return 'The password is too weak. Please choose a stronger password.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}
