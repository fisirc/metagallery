import iconDark from '@/assets/favicon.svg';
import iconWhite from '@/assets/favicon_white.svg';
import { useColorScheme } from '@mantine/hooks';

interface AppIconProps {
  size: number;
  animated: boolean;
}

export const AppIcon = ({ size, animated }: AppIconProps) => {
  const theme = useColorScheme();

  return (
    <>
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
      <img src={theme === 'dark' ? iconWhite : iconDark} width={size} style={{
        'animation': animated ? 'floating 3s infinite' : 'none',
        'pointerEvents': 'none',
      }} />
    </>
  );
}
