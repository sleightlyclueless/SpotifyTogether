import { Box, BoxProps } from "@chakra-ui/react";
import { AppHeader, AppHeaderProps } from "./header/AppHeader.tsx";
import { Page } from "./header/Page.tsx";

export type BaseLayoutProps = BoxProps & AppHeaderProps;
export const BaseLayout = ({
  leftMenuEntries,
  children,
  rightMenuEntries,
  ...props
}: BaseLayoutProps) => {
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
