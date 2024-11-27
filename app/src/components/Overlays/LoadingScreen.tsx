import { Center, Stack, Text } from "@mantine/core";
import { AppIcon } from "../AppIcon";

export const LoadingScreen = () => {
  return (
    <Center h={'100vh'}>
      <Stack align="center">
        <AppIcon animated size={100} />
        <Text size="xl" mt={18}>Cargando metagallery...</Text>
      </Stack>
    </Center>
  );
}
