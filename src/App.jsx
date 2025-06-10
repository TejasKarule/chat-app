import Chat from "./Components/chat/chat";
import List from "./Components/list/list";
import Details from "./Components/details/details";
import Login from "./Components/login/Login";
import Notification from "./Components/notification/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import useUserStore from "./lib/userStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged user:", user);
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        fetchUserInfo(null);
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log("Rendering App, currentUser:", currentUser);

  if (!currentUser) {
    return (
      <div className="container">
        <Login />
      </div>
    );
  }

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!currentUser) {
    console.log("User not loaded");
    return <Login />;
  }
  console.log("User loaded:", currentUser);

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          <Chat />
          <Details />
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
