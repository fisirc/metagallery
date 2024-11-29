import { useLocation } from "wouter";
import { AppIcon } from "./AppIcon";
import { Tooltip } from "@mantine/core";

export const AppIconButton = () => {
  const [, setLocation] = useLocation();

  return (
    <Tooltip label="Metagallery">
      <div style={{ cursor: 'pointer' }} onClick={() => {
        setLocation("/dashboard");
      }}>
        <AppIcon size={44} animated={false} />
      </div>
    </Tooltip>
  );
}
