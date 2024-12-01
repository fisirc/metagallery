import iconDark from '@/assets/favicon.svg';
import iconWhite from '@/assets/favicon_white.svg';
import { negateIf } from '@/utils';
import { useMantineColorScheme } from '@mantine/core';

interface AppIconProps {
  size: number;
  animated?: boolean;
  withText?: string;
  inverse?: boolean;
}

export const AppIcon = ({ size, animated, inverse, withText }: AppIconProps) => {
  const { colorScheme: theme } = useMantineColorScheme();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }}>
      {
        animated && <style>
          {`
          @keyframes floating {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(10px);
            }
            100% {
              transform: translateY(0);
            }
          }
        `}
        </style>
      }
      <img src={negateIf(theme === 'dark', inverse) ? iconWhite : iconDark} width={size} style={{
        'animation': animated ? 'floating 3s infinite' : 'none',
        'pointerEvents': 'none',
      }} />
      {withText && <span style={{ fontWeight: 700, fontSize: size / 2, marginLeft: 8 }}>{withText}</span>}
    </div>
  );
}
