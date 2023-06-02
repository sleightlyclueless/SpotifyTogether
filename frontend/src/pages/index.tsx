import React from "react";
import {
  Box,
  Heading,
  Button,
  Text,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AppLayout } from "../layout/AppLayout.tsx";

export const OverviewPage: React.FC = () => {
  return (
    <AppLayout>
      <Box textAlign="left" p={4}>
        <Heading as="h1" size="xl" mb={6}>
          Welcome I guess!
        </Heading>
      </Box>
    </AppLayout>
  );
};
