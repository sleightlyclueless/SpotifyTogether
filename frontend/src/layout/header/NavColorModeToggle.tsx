import { forwardRef, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { NavButton, NavButtonProps } from "./Nav";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const NavColorModeToggle = forwardRef<NavButtonProps, "button">(
  (props, ref) => {
    const { toggleColorMode } = useColorMode();

    const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
    const label = useColorModeValue(
      "Darkmode aktivieren",
      "Lightmode aktivieren"
    );

    return (
      <NavButton
        icon={icon}
        aria-label={label}
        onClick={toggleColorMode}
        ref={ref}
        {...props}
      />
    );
  }
);
