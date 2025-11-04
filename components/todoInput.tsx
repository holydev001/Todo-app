import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, View, Image, Dimensions } from "react-native";

interface TodoInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  placeholder?: string;
  theme: any;
}

export default function TodoInput({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
  theme,
}: TodoInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(
    Dimensions.get("window").width <= 375
  );

  // ✅ Update responsiveness on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = Dimensions.get("window").width;
      setIsMobile(width <= 375);
    };

    const subscription = Dimensions.addEventListener("change", handleResize);
    return () => subscription?.remove?.();
  }, []);

  // ✅ Theme-based icons
  const uncheckedLight = require("../assets/icons/unchecked-light.png");
  const uncheckedDark = require("../assets/icons/unchecked-dark.png");
  const iconSource = theme.mode === "dark" ? uncheckedDark : uncheckedLight;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          width: isMobile ? 327 : 540,
          height: isMobile ? 48 : 64,
          paddingHorizontal: isMobile ? 20 : 24,
          paddingTop: isMobile ? "auto" : 20,

          paddingBottom: isMobile ? "auto" : 19,
          marginTop: isMobile ? 40 : 40,
          marginBottom: isMobile ? 16 : 24,
        },
      ]}
    >
      <Image source={iconSource} style={[styles.icon]} />

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            fontSize: isMobile ? 12 : 18,
          },
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        blurOnSubmit={false}
        returnKeyType="done"
        multiline={false} // ✅ single-line
        textAlignVertical="center" // ✅ vertically center text
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 20,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    fontFamily: "JosefinSans_400Regular",
    borderWidth: 0,
    outlineStyle: undefined, // ✅ removes blue focus outline on web
  },
});
