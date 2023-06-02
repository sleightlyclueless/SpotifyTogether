import React from "react";

interface SpotifyAuthButtonProps {
  onClick: () => void;
  isAuthorized: boolean;
}

export const SpotifyAuthButton: React.FC<SpotifyAuthButtonProps> = ({
  onClick,
  isAuthorized,
}) => {
  if (isAuthorized) {
    return <button className="btn btn-primary">Authorized</button>;
  }

  return (
    <button className="btn btn-primary" onClick={onClick}>
      Authorize with Spotify
    </button>
  );
};