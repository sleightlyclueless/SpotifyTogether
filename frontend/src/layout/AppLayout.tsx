import * as React from "react";
import { BaseLayout, BaseLayoutProps } from "./BaseLayout";
import { NavItem, NavLink } from "./header/Nav.tsx";
import { NavColorModeToggle } from "./header/NavColorModeToggle.tsx";
import { AuthButton } from "./header/AuthButton.tsx";

const HeaderMenu: React.FC = () => {
  return (
    <>
      <NavItem>
        <NavLink>Home</NavLink>
      </NavItem>
    </>
  );
};

const headerRightMenu = (
  <>
    <NavItem>
      <NavColorModeToggle display="inline" />
    </NavItem>
    <NavItem>
      <AuthButton />
    </NavItem>
  </>
);

export type AppLayoutProps = BaseLayoutProps;

export const AppLayout = (props: AppLayoutProps) => (
  <BaseLayout
    leftMenuEntries={<HeaderMenu />}
    rightMenuEntries={headerRightMenu}
    {...props}
  />
);
