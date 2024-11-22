import icon from '@/assets/favicon.svg';

interface AppIconProps {
  size: number;
  animated: boolean;
}

export const AppIcon = ({ size, animated }: AppIconProps) => {
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
      <img src={icon} width={size} style={{
        'animation': animated ? 'floating 3s infinite' : 'none',
        'pointerEvents': 'none',
      }} />
    </>
  );
}
