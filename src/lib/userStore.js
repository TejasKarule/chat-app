import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    console.log("Fetching", uid); // ADD THIS
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      console.log("Document exists:", docSnap.exists()); // ADD THIS

      if (docSnap.exists()) {
        console.log("User Data:", docSnap.data()); // ADD THIS
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log("ERROR:", err); // ADD THIS
      return set({ currentUser: null, isLoading: false });
    }
  },
}));

export default useUserStore;
