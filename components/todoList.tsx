import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import TodoItem, { Todo } from "./todoItem";
import { Id } from "../convex/_generated/dataModel";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ✅ Needed for drag gestures

interface Props {
  todos: Todo[];
  theme: any;
  onToggle: (id: Id<"todos">) => void;
  onDelete: (id: Id<"todos">) => void;
  onClearCompleted?: () => void;
  onReorder?: (newOrder: Todo[]) => void;
}

export default function TodoList({
  todos,
  theme,
  onToggle,
  onDelete,
  onClearCompleted,
  onReorder,
}: Props) {
  const [data, setData] = useState<Todo[]>(todos);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    setData(todos);
  }, [todos]);

  // ✅ Filtered Todos
  const filteredTodos = data.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const remainingCount = data.filter((t) => !t.completed).length;

  // ✅ Responsive sizing
  const { width } = Dimensions.get("window");
  const isMobile = width < 480;
  const containerWidth = Math.min(Math.max(width - 40, 327), 540);

  // ✅ Hover logic (web only)
  const handleHover = (f: string | null) => {
    if (Platform.OS === "web") setHovered(f);
  };

  const renderFilterButton = (f: string) => {
    const isActive = filter === f;
    const isHovered = hovered === f;

    const color = isActive
      ? "#3A7CFD" // Active color
      : isHovered
        ? theme.text // Hover color
        : theme.placeholder;

    const hoverEvents =
      Platform.OS === "web"
        ? {
            onMouseEnter: () => handleHover(f),
            onMouseLeave: () => handleHover(null),
          }
        : undefined;

    return (
      <TouchableOpacity
        key={f}
        onPress={() => setFilter(f as any)}
        {...(hoverEvents ?? {})}
      >
        <Text style={[styles.filterText, { color }]}>
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  // ✅ Render Draggable Item
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={drag}
      disabled={isActive}
      style={{ opacity: isActive ? 0.8 : 1 }}
    >
      <TodoItem
        item={item}
        theme={theme}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <>
        <View
          style={[
            styles.listContainer,
            { backgroundColor: theme.card, width: containerWidth },
          ]}
        >
          <View style={{ minHeight: 100 }}>
            <DraggableFlatList
              data={filteredTodos}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              onDragEnd={({ data: newData }) => {
                setData(newData);
                onReorder?.(newData);
              }}
              activationDistance={10}
            />
          </View>

          {/* ✅ Footer */}
          <View
            style={[
              styles.footer,
              {
                height: isMobile ? 48 : 64,
              },
              { borderTopColor: theme.border },
            ]}
          >
            <Text style={[styles.countText, { color: theme.placeholder }]}>
              {remainingCount} items left
            </Text>

            {/* Desktop Filters */}
            {!isMobile && (
              <View style={styles.filters}>
                {["all", "active", "completed"].map(renderFilterButton)}
              </View>
            )}

            <TouchableOpacity onPress={() => onClearCompleted?.()}>
              <Text style={[styles.clearText, { color: theme.placeholder }]}>
                Clear Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Mobile Filter Box (Separate) */}
        {isMobile && (
          <View
            style={[
              styles.mobileFilters,
              {
                height: 52,
                backgroundColor: theme.card,
                width: containerWidth,
              },
            ]}
          >
            {["all", "active", "completed"].map(renderFilterButton)}
          </View>
        )}
      </>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 35 },
    shadowOpacity: 0.5,
    shadowRadius: 70,
    elevation: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  countText: {
    fontSize: 12,
    fontFamily: "JosefinSans_400Regular",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "JosefinSans_700Bold",
  },
  clearText: {
    fontSize: 12,
    fontFamily: "JosefinSans_400Regular",
  },
  mobileFilters: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 12,
    alignSelf: "center",
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 35 },
    shadowOpacity: 0.5,
    shadowRadius: 70,
    elevation: 10,
  },
});
