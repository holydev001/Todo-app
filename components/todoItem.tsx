import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Id } from "../convex/_generated/dataModel";

// ✅ Todo type
export interface Todo {
  id: Id<"todos">;
  title: string;
  completed: boolean;
}

interface Props {
  item: Todo;
  theme: any;
  onToggle?: (id: Id<"todos">) => void;
  onDelete?: (id: Id<"todos">) => void;
}

export default function TodoItem({ item, theme, onToggle, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const { width } = Dimensions.get("window");
  const isMobile = width <= 375;

  const uncheckedLight = require("../assets/icons/unchecked-light.png");
  const uncheckedDark = require("../assets/icons/unchecked-dark.png");
  const checkedIcon = require("../assets/icons/checked.png");
  const hoverIcon = require("../assets/icons/hover.png");
  const deleteIcon = require("../assets/icons/cross.png");

  const iconSource = item.completed
    ? checkedIcon
    : hovered && Platform.OS === "web"
      ? hoverIcon
      : theme.mode === "dark"
        ? uncheckedDark
        : uncheckedLight;

  const showDelete = Platform.OS !== "web" || hovered;

  return (
    <View
      style={[
        styles.rowContainer,
        {
          height: isMobile ? 52 : 64,
          width: isMobile ? 327 : 540,
          paddingHorizontal: isMobile ? 20 : 24,
          paddingTop: isMobile ? 14 : 20,
          paddingBottom: isMobile ? 14 : 19,
        },
        { borderBlockColor: theme.borderBottomColor },
      ]}
      {...(Platform.OS === "web"
        ? {
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false),
          }
        : {})}
    >
      {/* Left: check icon + title */}
      <TouchableOpacity
        style={styles.leftSection}
        onPress={() => onToggle && onToggle(item.id)}
        activeOpacity={0.7}
      >
        <Image
          source={iconSource}
          style={[
            styles.icon,
            { width: isMobile ? 20 : 24, height: isMobile ? 20 : 24 },
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              fontSize: isMobile ? 12 : 18,
              color: item.completed ? theme.placeholder : theme.text,
              textDecorationLine: item.completed ? "line-through" : "none",
              opacity: item.completed ? 0.6 : 1,
            },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      {/* Right: delete */}
      {showDelete && (
        <TouchableOpacity onPress={() => onDelete && onDelete(item.id)}>
          <Image
            source={deleteIcon}
            style={[
              styles.deleteIcon,
              { width: isMobile ? 11.79 : 18, height: isMobile ? 11.79 : 18 },
            ]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    maxWidth: 540,
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 24,
    letterSpacing: 0.25,
    resizeMode: "contain",
  },
  text: {
    fontSize: 18,
    fontFamily: "JosefinSans_400Regular",
  },
  deleteIcon: {
    resizeMode: "contain",
  },
});
