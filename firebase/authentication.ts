import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase/config';

export async function signUp(email: string, password: string) {
  await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(
    FIREBASE_AUTH,
    email,
    password
  );
}