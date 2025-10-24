import { useUser } from '@/stores/useUser';
import { Avatar, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconLogout, IconSettings } from '@tabler/icons-react';
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

export const UserButton = () => {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const menuItems = [
    {
      icon: IconSettings,
      label: 'Ajustes de cuenta',
      onClick: () => setLocation('/account'),
    },
    {
      icon: IconLogout,
      label: 'Cerrar sesión',
      onClick: () => {
        useUser.getState().logout();
      },
    },
  ];

  return (
    <Menu
      position="bottom-end"
      offset={15}
    >
      <Menu.Target>
        <UnstyledButton
          style={{
            borderRadius: 'var(--mantine-radius-sm)',
          }}
        >
          <Group gap="xs" mr={4} wrap='nowrap'>
            <Avatar
              src="https://i.pinimg.com/736x/39/47/d3/3947d3c4ca7f05c6be20e735adb0a35a.jpg"
              radius="xl"
              style={{ cursor: 'pointer' }}
            />
            <div style={{ flex: 1, width: 130 }}>
              <Text size="sm" fw={500} style={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>
                {user.displayname}
              </Text>
              <Text c="dimmed" size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>
                {user.mail}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Group gap="xs" mr={4} m={6}>
          <Avatar
            src="https://i.pinimg.com/736x/39/47/d3/3947d3c4ca7f05c6be20e735adb0a35a.jpg"
            radius="xl"
            style={{ cursor: 'pointer' }}
            size={64}
          />
          <div style={{ flex: 1, width: 200 }}>
            <Text size="xl" fw={500} style={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>
              {user.displayname}
            </Text>
            <Text c="dimmed" size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', }}>
              {user.mail}
            </Text>
          </div>
        </Group>
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
