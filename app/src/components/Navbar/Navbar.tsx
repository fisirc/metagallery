import {
  Tooltip,
  UnstyledButton,
  Stack,
  Image,
} from '@mantine/core';

import { useLocation } from 'wouter';
import logo from '#/assets/logo.svg';
import classes from './Navbar.module.css';

import UserButton from '../UserButton';

import pages from '@/pages';

interface NavbarLinkProps {
  label: string;
  icon: React.FC<any>;
  onClick: () => void;
  active?: boolean;
}

const NavbarLink = ({
  label,
  icon: Icon,
  active,
  onClick,
}: NavbarLinkProps) => (
  <Tooltip
    label={label}
    position="right"
    transitionProps={{ duration: 250, enterDelay: 1000 }}
    offset={12}
  >
    <UnstyledButton
      className={classes.link}
      data-active={active || undefined}
      onClick={onClick}
    >
      <Icon
        style={{
          width: 20,
          height: 20,
        }}
        stroke={1.5}
      />
    </UnstyledButton>
  </Tooltip>
);

const Navbar = () => {
  const [location, setLocation] = useLocation();

  const links = pages.map(page => (
    <NavbarLink
      key={page.href}
      label={page.label}
      icon={page.icon}
      active={location === page.href}
      onClick={() => setLocation(page.href)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Stack
        p={10}
        py={30}
        h="100%"
        align="center"
        gap={50}
      >
        <Image
          src={logo}
          w={30}
        />
        <Stack
          align="center"
          h="100%"
          justify="space-between"
        >
          <Stack
            justify="center"
            gap={0}
          >
            {links}
          </Stack>
          <UserButton />
        </Stack>
      </Stack>
    </nav>
  );
};

export default Navbar;
