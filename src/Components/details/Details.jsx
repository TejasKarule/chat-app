import "./details.css";
import { auth } from "../../lib/firebase";
import useUserStore from "../../lib/userStore";
import useChatStore from "../../lib/chatStore";
import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const Details = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="details">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>I'm gonna be king of the pirates</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="/arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3xkV0TZMll3HkZWmoxNscKwQJPk2Rn_Ojuw&s"
                  alt=""
                />
                <span>photo_going_merry.png</span>
              </div>
              <img src="/download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3xkV0TZMll3HkZWmoxNscKwQJPk2Rn_Ojuw&s"
                  alt=""
                />
                <span>photo_going_merry.png</span>
              </div>
              <img src="/download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3xkV0TZMll3HkZWmoxNscKwQJPk2Rn_Ojuw&s"
                  alt=""
                />
                <span>photo_going_merry.png</span>
              </div>
              <img src="/download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3xkV0TZMll3HkZWmoxNscKwQJPk2Rn_Ojuw&s"
                  alt=""
                />
                <span>photo_going_merry.png</span>
              </div>
              <img src="/download.png" alt="" className="icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="/arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "you are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block user"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Details;
