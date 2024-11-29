import { Burger, Menu } from '@mantine/core';

import {
  IconLayout,
} from '@tabler/icons-react';

import { primaryIconProps } from '@/constants';
import { useLocation } from 'wouter';

export const MenuBurger = () => {
  const [location, setLocation] = useLocation();

  const options = [
    {
      Icon: <IconLayout {...primaryIconProps} />,
      label: 'Volver al menú',
      OnClick: () => {
        setLocation('/dashboard');
      }
    },
  ];

  return (
    <Menu
      position="bottom-start"
      offset={15}
    >
      <Menu.Target>
        <Burger
          size="xs"
          title="Menu"
        />
      </Menu.Target>
      <Menu.Dropdown>
        {
          options.map(option => (
            <Menu.Item
              key={option.label}
              leftSection={option.Icon}
              onClick={() => {
                option.OnClick();
              }}
            >
              {option.label}
            </Menu.Item>
          ))
        }
      </Menu.Dropdown>
    </Menu>
  );
};
