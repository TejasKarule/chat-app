import { useEffect, useState } from "react";
import "./chatlist.css";
import AddUser from "./adduser/Adduser";
import useUserStore from "../../../lib/userStore";
import useChatStore from "../../../lib/chatStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (docSnap) => {
        const data = docSnap.data();

        if (!data?.chats?.length) {
          setChats([]);
          return;
        }

        const enrichedChats = await Promise.all(
          data.chats.map(async (chat) => {
            const userDocSnap = await getDoc(doc(db, "users", chat.receiverId));
            const user = userDocSnap.exists() ? userDocSnap.data() : null;
            return {
              ...chat,
              user,
            };
          })
        );

        setChats(enrichedChats.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unsub();
  }, [currentUser]);
  const handleSelect = async (chat) => {
    const userchats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userchats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userchats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userchats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {filteredChats.map((chat, index) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage || "No messages yet"}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default Chatlist;
