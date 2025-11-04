import React from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function ThemeSwitcher({ isDark, toggleTheme }: Props) {
  const { width } = Dimensions.get("window");
  const isMobile = width <= 375;
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.button,
        {
          height: isMobile ? 20 : 48,
        },
      ]}
    >
      <Image
        source={
          isDark
            ? require("../assets/icons/light.png") // show sun when in dark mode
            : require("../assets/icons/dark.png") // show moon when in light mode
        }
        style={[
          {
            width: isMobile ? 20 : 26,
            height: isMobile ? 20 : 26,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
  },
});
