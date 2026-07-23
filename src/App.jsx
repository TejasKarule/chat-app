import Chat from "./Components/chat/Chat";
import List from "./Components/list/list";
import Details from "./Components/details/Details";
import Login from "./Components/login/Login";
import Notification from "./Components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import useUserStore from "./lib/userStore";
import useChatStore from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log("👤 Firebase user:", user);
      fetchUserInfo(user ? user.uid : null);
    });

    return () => unSub();
  }, [fetchUserInfo]);

  console.log("📦 currentUser:", currentUser);
  console.log("⏳ isLoading:", isLoading);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!currentUser) return <Login />;

  return (
    <div className="container">
      <List />
      {chatId && <Chat />}
      {chatId && <Details />}
      <Notification />
    </div>
  );
};

export default App;
