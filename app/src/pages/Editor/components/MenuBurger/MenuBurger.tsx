import { Burger, Menu } from '@mantine/core';

import {
  IconLayout,
} from '@tabler/icons-react';

import { primaryIconProps } from '@/constants';

const MenuBurger = () => {
  const options = [
    {
      Icon: <IconLayout {...primaryIconProps} />,
      label: 'Ver plantillas',
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
          >
            {option.label}
          </Menu.Item>
        ))
      }
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuBurger;
