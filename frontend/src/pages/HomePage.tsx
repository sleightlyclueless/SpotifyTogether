import { FunctionComponent } from "react";
import { Header, PageContainer, PlaylistOverview } from "../components";
import { NewPlaylistButton } from "../components/NewPlaylistButton";

export const HomePage: FunctionComponent = () => {
  return (
    <PageContainer>
      <Header title={"Home"} />
      <PlaylistOverview />
      <NewPlaylistButton />
    </PageContainer>
  );
};
