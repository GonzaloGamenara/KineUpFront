import { useEffect, useRef } from "react";

export default function GoogleLoginButton({ onSuccess }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!window.google) return;

    initialized.current = true;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        onSuccess(response.credential);
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      {
        theme: "outline",
        size: "large",
        width: 320,
      }
    );
  }, [onSuccess]);

  return <div id="google-login-button" />;
}