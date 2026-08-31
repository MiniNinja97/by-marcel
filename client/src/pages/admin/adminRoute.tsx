import { useEffect, useRef, useState } from "react";

import Admin from "./admin";
import AdminLogin from "./adminLogin";

import {
  checkAdminSession,
  logoutAdmin,
} from "../../api/auth";

const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minuter

export default function AdminRoute() {
  const [authenticated, setAuthenticated] =
    useState<boolean | null>(null);

  const inactivityTimer = useRef<number | null>(null);

  const checkSession = async () => {
    try {
      const admin = await checkAdminSession();

      setAuthenticated(admin !== null);
    } catch (error) {
      console.error(error);
      setAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error(error);
    } finally {
      setAuthenticated(false);
    }
  };

  const startInactivityTimer = () => {
    if (inactivityTimer.current !== null) {
      window.clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = window.setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIME);
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    const handleActivity = () => {
      startInactivityTimer();
    };

    startInactivityTimer();

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(
          event,
          handleActivity,
        );
      });

      if (inactivityTimer.current !== null) {
        window.clearTimeout(inactivityTimer.current);
      }
    };
  }, [authenticated]);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  if (authenticated === null) {
    return <p>Kontrollerar inloggning...</p>;
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div>
      <div className="admin-session-bar">
        <button
          className="admin-btn danger"
          type="button"
          onClick={handleLogout}
        >
          Logga ut
        </button>
      </div>

      <Admin />
    </div>
  );
}