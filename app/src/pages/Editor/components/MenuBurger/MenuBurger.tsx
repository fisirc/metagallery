import { Burger, Menu } from '@mantine/core';

const MenuBurger = () => (
  <Menu
    position="bottom-start"
  >
    <Menu.Target>
      <Burger
        size="xs"
      />
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item>
        hola
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

export default MenuBurger;
