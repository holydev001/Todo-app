// index.tsx
import React from "react";
import { registerRootComponent } from "expo";
import { useFonts, JosefinSans_400Regular, JosefinSans_700Bold } from "@expo-google-fonts/josefin-sans";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "./hooks/useTheme";
import App from "./App";

function Main() {
  const [fontsLoaded] = useFonts({
    JosefinSans_400Regular,
    JosefinSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

registerRootComponent(Main);
