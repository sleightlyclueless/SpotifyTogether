import { Box, chakra, forwardRef, HTMLChakraProps } from "@chakra-ui/react";
import * as React from "react";

export const Nav = forwardRef<HTMLChakraProps<"ul">, "ul">((props, ref) => (
  <chakra.ul role="menu" flex={1} ref={ref} display="flex" {...props} />
));

export const NavItem = forwardRef<HTMLChakraProps<"li">, "li">((props, ref) => (
  <chakra.li listStyleType="none" role="none" ref={ref} {...props} />
));

export interface NavButtonProps extends HTMLChakraProps<"button"> {
  icon?: React.ReactNode;
}

export const NavButton = forwardRef<NavButtonProps, "button">(
  ({ icon, children, ...props }, ref) => {
    return (
      <chakra.button ref={ref} {...props}>
        {icon} {children}{" "}
      </chakra.button>
    );
  }
);

export type NavLinkProps = HTMLChakraProps<"a">;

export const NavLink = forwardRef<NavLinkProps, "a">(
  ({ children, ...linkProps }, ref) => {
    return (
      <chakra.a ref={ref} {...linkProps}>
        <Box>{children}</Box>
      </chakra.a>
    );
  }
);
