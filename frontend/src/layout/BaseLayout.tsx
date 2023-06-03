import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { AppHeader, AppHeaderProps } from "./header/AppHeader";
import { Page } from "./header/Page";

export type BaseLayoutProps = BoxProps & AppHeaderProps;

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  leftMenuEntries,
  children,
  rightMenuEntries,
  ...props
}) => {

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
    </Box>
  );
};