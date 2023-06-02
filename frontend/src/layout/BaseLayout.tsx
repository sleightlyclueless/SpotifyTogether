import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { AppHeader, AppHeaderProps } from "./header/AppHeader";
import { Page } from "./header/Page";
import { SpotifyAuth } from "./hooks/SpotifyAuth";

export type BaseLayoutProps = BoxProps & AppHeaderProps;

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  leftMenuEntries,
  children,
  rightMenuEntries,
  ...props
}) => {
  const handleSpotifyAuthSuccess = () => {
    console.log("Spotify authorization successful!");
    // Perform any additional actions or state updates here
    // For example, update the user's authorization status, fetch user data, etc.
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      bg={"gray.200"}
      _dark={{ bg: "initial" }}
      {...props}
      height={"100vh"}
    >
      <AppHeader
        leftMenuEntries={leftMenuEntries}
        rightMenuEntries={rightMenuEntries}
      />
      <Page>{children}</Page>

      <Box display="flex" justifyContent="center" mt="4">
        <SpotifyAuth onSuccess={handleSpotifyAuthSuccess} />
      </Box>
    </Box>
  );
};