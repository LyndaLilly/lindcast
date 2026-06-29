import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function OpenChallenge() {
  const { token } = useParams();

  useEffect(() => {
    const appUrl = `stakeova://challenge/${token}`;

    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.lyli.stakeova";

    // Try opening the app
    window.location.href = appUrl;

    // If the app doesn't open, go to Play Store after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = playStoreUrl;
    }, 2000);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
      }}
    >
      Opening Stakeova...
    </div>
  );
}