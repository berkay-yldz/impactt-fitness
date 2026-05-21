export const loginUser = async (email, password) => {
  // Eran buraya gerçek Firebase Auth kodunu yazacak
  console.log("authService: Giriş isteği alındı", email);
  return { success: true };
};

export const registerUser = async (email, password, displayName) => {
  // Eran buraya gerçek Firebase Auth kayıt kodunu yazacak
  console.log("authService: Kayıt isteği alındı", email, displayName);
  return { success: true };
};

export const logoutUser = async () => {
  console.log("authService: Çıkış yapıldı");
  return { success: true };
};
