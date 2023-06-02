import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider.tsx";
import { NavLink } from "./Nav.tsx";

export const AuthButton = () => {
  const {
    user,
    actions: { logout },
  } = useAuth();
  return user ? (
    <Menu>
      <MenuButton
        size={"sm"}
        as={Button}
        variant="ghost"
        rightIcon={<ChevronDownIcon />}
      >
        Hello {user.firstName} {user.lastName}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <NavLink as={RouterNavLink} to={"/auth/login"}>
      Login
    </NavLink>
  );
};
