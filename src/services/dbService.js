export const createUserProfile = async (uid, data) => {
  // Eran buraya gerçek Firestore setDoc kodunu yazacak
  console.log("dbService: Firestore'a yazılan profil verisi:", uid, data);
  return { success: true };
};

export const getUserProfile = async (uid) => {
  console.log("dbService: Profil çekiliyor", uid);
  return { isPremium: false, programLevel: "beginner" };
};
