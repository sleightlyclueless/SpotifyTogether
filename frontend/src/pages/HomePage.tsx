import { FunctionComponent, useEffect } from "react";
import { Header, PageContainer, PlaylistOverview } from "../components";
import { NewPlaylistButton } from "../components/NewPlaylistButton";
import axios from "axios";

export const HomePage: FunctionComponent = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get("user") || "";

  useEffect(() => {
    fetchSpotifyUserId(user);
  }, [user]);

  const fetchSpotifyUserId = (user: string) => {
    axios
      .get(`http://localhost:4000/account/spotifyUserId`, {
        params: { user: user },
      })
      .then((res) => {
        console.log("Response:", res.data);
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
    </PageContainer>
  );
};
