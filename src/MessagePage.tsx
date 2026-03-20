import { useNavigate } from "react-router-dom";

function MessagePage() {
    const navigate = useNavigate();

    function userLogout() {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            navigate("/");
        }
    }

  return (
    <div className="messagePage">
      <h1>Messages</h1>

      <div className="logout-btn-container">
            <button className="logout-btn" onClick={userLogout}>
              LOGOUT
            </button>
      </div>
    </div>
  );
}

export default MessagePage;