import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

const errorMessages = {
  "auth/email-already-in-use": "Bu e-posta adresi zaten kullanımda.",
  "auth/invalid-email": "Geçersiz e-posta adresi.",
  "auth/operation-not-allowed": "E-posta/şifre ile giriş şu anda aktif değil.",
  "auth/weak-password": "Şifre en az 6 karakter olmalı.",
  "auth/user-disabled": "Bu hesap devre dışı bırakılmış.",
  "auth/user-not-found": "Bu e-posta ile kayıtlı kullanıcı bulunamadı.",
  "auth/wrong-password": "Hatalı şifre.",
  "auth/invalid-credential": "E-posta veya şifre hatalı.",
  "auth/too-many-requests": "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.",
  "auth/network-request-failed": "İnternet bağlantınızı kontrol edin.",
  "auth/missing-password": "Lütfen şifrenizi girin.",
  "auth/missing-email": "Lütfen e-posta adresinizi girin.",
};

function translateError(error) {
  return errorMessages[error.code] || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
}

export async function registerUser(email, password, displayName) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return { user: cred.user, error: null };
  } catch (error) {
    return { user: null, error: translateError(error) };
  }
}

export async function loginUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { user: cred.user, error: null };
  } catch (error) {
    return { user: null, error: translateError(error) };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: translateError(error) };
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
