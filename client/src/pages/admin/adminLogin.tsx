import { useState } from "react";
import {
  loginAdmin,
  forgotAdminPassword,
} from "../../api/auth";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({
  onLogin,
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [forgotPasswordMode, setForgotPasswordMode] =
    useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [forgotMessage, setForgotMessage] =
    useState("");

  const [forgotLoading, setForgotLoading] =
    useState(false);

  // ========================================
  // LOGGA IN
  // ========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Fyll i e-post och lösenord.");
      return;
    }

    try {
      setLoading(true);

      await loginAdmin(
        email.trim(),
        password,
      );

      onLogin();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Kunde inte logga in.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // GLÖMT LÖSENORD
  // ========================================

  const handleForgotPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setForgotMessage("");

    if (!forgotEmail.trim()) {
      setError("Fyll i din e-postadress.");
      return;
    }

    try {
      setForgotLoading(true);

      const message =
        await forgotAdminPassword(
          forgotEmail.trim(),
        );

      setForgotMessage(message);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Kunde inte skicka återställningsmejlet.",
        );
      }
    } finally {
      setForgotLoading(false);
    }
  };

  // ========================================
  // GLÖMT LÖSENORD
  // ========================================

  if (forgotPasswordMode) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <h1>Återställ lösenord</h1>

          <form onSubmit={handleForgotPassword}>
            <div className="admin-form-group">
              <label htmlFor="forgot-email">
                E-post
              </label>

              <input
                id="forgot-email"
                className="admin-input"
                type="email"
                value={forgotEmail}
                onChange={(event) =>
                  setForgotEmail(
                    event.target.value,
                  )
                }
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <p className="admin-login-error">
                {error}
              </p>
            )}

            {forgotMessage && (
              <p className="admin-login-error">
                {forgotMessage}
              </p>
            )}

            <button
              className="admin-save-btn"
              type="submit"
              disabled={forgotLoading}
            >
              {forgotLoading
                ? "Skickar..."
                : "Skicka återställningsmejl"}
            </button>

            <button
              className="admin-forgot-password"
              type="button"
              onClick={() => {
                setForgotPasswordMode(false);
                setError("");
                setForgotMessage("");
              }}
            >
              Tillbaka till inloggning
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================
  // VANLIG INLOGGNING
  // ========================================

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1>Admin</h1>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">
              E-post
            </label>

            <input
              id="admin-email"
              className="admin-input"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">
              Lösenord
            </label>

            <input
              id="admin-password"
              className="admin-input"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button
            className="admin-save-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Loggar in..."
              : "Logga in"}
          </button>

          <button
            className="admin-forgot-password"
            type="button"
            onClick={() => {
              setForgotEmail(email);
              setForgotPasswordMode(true);
              setError("");
              setForgotMessage("");
            }}
          >
            Glömt lösenordet?
          </button>
        </form>
      </div>
    </div>
  );
}