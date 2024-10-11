import {
  Avatar,
  Menu,
} from '@mantine/core';

import {
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';

import { useLocation } from 'wouter';

interface MenuItemProps {
  icon: React.FC<any>;
  label: string;
  onClick?: () => void;
}

const MenuItem = ({ icon: Icon, label, onClick }: MenuItemProps) => (
  <Menu.Item
    leftSection={<Icon style={{ width: 16, height: 16 }} stroke={1.5} />}
    pr={20}
    onClick={onClick}
  >
    {label}
  </Menu.Item>
);

const UserButton = () => {
  const [, setLocation] = useLocation();

  const menuItems = [
    {
      icon: IconSettings,
      label: 'Ajustes de cuenta',
      onClick: () => setLocation('/account'),
    },
    {
      icon: IconLogout,
      label: 'Cerrar sesión',
      onClick: () => {},
    },
  ];

  return (
    <Menu
      position="right-end"
      offset={15}
    >
      <Menu.Target>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
          radius="xl"
          size={30}
        />
      </Menu.Target>
      <Menu.Dropdown>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
          />
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserButton;
