import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useTranslation } from "../i18n";
import Sidebar from "../components/Sidebar";
import './EditProfilePage.css'; // <-- Nuevo CSS completo

export default function EditUserPage() {
  const { t } = useTranslation();

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/user/getUserProfile`,
        {},
        { withCredentials: true }
      );

      setUser(res.data);
      setUsername(res.data.username);
    } catch (err: any) {
      setError(err.response?.data || err.message);
    }
  };

  const saveUsername = async () => {
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_URL}/api/user/editUsername`, { username }, {
        withCredentials: true,
      });

      setSuccess(t("editUser.usernameUpdated"));
      loadProfile();
    } catch (err: any) {
      setError(err.response?.data || err.message);
    }
  };

  const changePassword = async () => {
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError(t("editUser.passwordMatch"));
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/user/changePassword`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      setSuccess(t("editUser.passwordChanged"));

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data || err.message);
    }
  };

  if (!user) return <p style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>Loading...</p>;

  return (
    <>
      <Sidebar />
      <div className="edit-profile-page">
        <div className="edit-profile-card">

          <h2 className="auth-title">{t("editUser.title")}</h2>

          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`
              }
              alt="avatar"
            />
          </div>

          <label>{t("editUser.email")}</label>
          <input value={user.email} disabled />

          <label>{t("editUser.username")}</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button onClick={saveUsername}>
            {t("editUser.updateUsername")}
          </button>

          <hr />

          <label>{t("editUser.currentPassword")}</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label>{t("editUser.newPassword")}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>{t("editUser.confirmPassword")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={changePassword}>
            {t("editUser.changePassword")}
          </button>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

        </div>
      </div>
    </>
  );
}