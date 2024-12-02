import { Center, Stack, Text } from "@mantine/core";
import { AppIcon } from "../AppIcon";

type LoadingScreenProps = {
  h?: number;
  mt?: number;
};

export const LoadingScreen = ({ h, mt }: LoadingScreenProps) => {
  return (
    <Center h={h ? h : '100vh'} mt={mt}>
      <Stack align="center">
        <AppIcon animated size={100} />
        <Text size="xl" mt={18}>Cargando metagallery...</Text>
      </Stack>
    </Center>
  );
}
