import React from "react";
import { chakra, Box, HStack } from "@chakra-ui/react";
import { Nav } from "./Nav.tsx";

export type AppHeaderProps = {
  leftMenuEntries?: React.ReactNode;
  rightMenuEntries?: React.ReactNode;
};

export const AppHeader = ({
  leftMenuEntries,
  rightMenuEntries,
}: AppHeaderProps) => {
  return (
    <HStack as="nav" p={4} bg="cyan.700">
      <chakra.a href={"/"} flex={1}>
        FWE 22
      </chakra.a>
      {leftMenuEntries ? (
        <Nav justifyContent="center">{leftMenuEntries}</Nav>
      ) : null}
      {rightMenuEntries ? (
        <Nav justifyContent="flex-end">{rightMenuEntries}</Nav>
      ) : (
        <Box role="none" flex="1" />
      )}{" "}
    </HStack>
  );
};
