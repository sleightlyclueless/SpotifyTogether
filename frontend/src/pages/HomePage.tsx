import { FunctionComponent, useState, useEffect } from "react";
import { Header, PageContainer, PlaylistOverview } from "../components";
import { NewPlaylistButton } from "../components/NewPlaylistButton";
import axios from "axios";

export const HomePage: FunctionComponent = () => {
  const [spotifyUserId, setSpotifyUserId] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get("user") || "";

  useEffect(() => {
    fetchSpotifyUserId();
  }, [user]); // Trigger the effect whenever the "user" parameter changes

  const fetchSpotifyUserId = () => {
    console.log("Fetching Spotify User ID: ", user);
    axios
      .get(`http://localhost:4000/account/spotifyUserId`, {
        headers: {
          Authorization: user,
        }
      })
      .then((res) => {
        setSpotifyUserId(res.data.spotifyUserId);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <PageContainer>
      <Header title={"Home"} />
      <PlaylistOverview />
      <NewPlaylistButton />
      <div>Spotify User ID: {spotifyUserId}</div>
    </PageContainer>
  );
};