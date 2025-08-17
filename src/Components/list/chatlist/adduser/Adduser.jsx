import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useState } from "react";
import useUserStore from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setUser({ id: docSnap.id, ...docSnap.data() });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setUser(null);
    }
  };

  const handleAdd = async () => {
    if (!currentUser?.id || !user?.id) {
      console.error("Missing user IDs");
      return;
    }

    const combinedId =
      currentUser.id > user.id
        ? currentUser.id + user.id
        : user.id + currentUser.id;

    try {
      const chatRef = doc(db, "chats", combinedId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });

        await setDoc(
          doc(db, "userchats", currentUser.id),
          {
            chats: [
              {
                chatId: combinedId,
                receiverId: user.id,
                updatedAt: Date.now(),
              },
            ],
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "userchats", user.id),
          {
            chats: [
              {
                chatId: combinedId,
                receiverId: currentUser.id,
                updatedAt: Date.now(),
              },
            ],
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Add chat error:", err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" required />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
