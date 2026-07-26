import { colors } from "@/theme/theme";
import { Stack } from "expo-router";

export default function ProblemsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: colors.background },
      }}
    />
  );
}
