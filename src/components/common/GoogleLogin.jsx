import { useEffect, useRef } from "react";

export default function GoogleLoginButton({ onSuccess, width = 336 }) {
  const initialized = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let retryId;

    const renderGoogleButton = () => {
      if (initialized.current) return;
      if (!window.google || !containerRef.current) {
        retryId = window.setTimeout(renderGoogleButton, 150);
        return;
      }

      initialized.current = true;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          onSuccess(response.credential);
        },
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width,
      });
    };

    renderGoogleButton();

    return () => {
      if (retryId) window.clearTimeout(retryId);
    };
  }, [onSuccess, width]);

  return (
    <div className="flex w-full justify-center">
      <div ref={containerRef} className="min-h-10 w-full max-w-[336px]" />
    </div>
  );
}
