import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, Dimensions } from "react-native";
import TodoInput from "./components/todoInput";
import TodoList from "./components/todoList";
import ThemeSwitcher from "./components/themeSwitcher";
import { useTheme } from "./hooks/useTheme";
import ThemedBackground from "./components/themedBackgrond";
import {
  ConvexProvider,
  ConvexReactClient,
  useQuery,
  useMutation,
} from "convex/react";
import { api } from "./convex/_generated/api";
import { Id } from "./convex/_generated/dataModel";

// ✅ Convex client
const Convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

// ✅ Todo type
type Todo = {
  id: Id<"todos">;
  title: string;
  completed: boolean;
};

export default function App() {
  return (
    <ConvexProvider client={Convex}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContent />
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}

function AppContent() {
  const { theme, isDark, toggleTheme } = useTheme();

  // ✅ Convex hooks
  const convexTodos = useQuery(api.todo.getAll);
  const createTodo = useMutation(api.todo.create);
  const toggleTodo = useMutation(api.todo.toggle);
  const deleteTodo = useMutation(api.todo.remove);

  // ✅ Local state
  const [text, setText] = useState("");
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);

  // ✅ Sync convex data to local
  useEffect(() => {
    if (convexTodos) {
      setLocalTodos(
        convexTodos.map((t) => ({
          id: t._id,
          title: t.title,
          completed: t.completed,
        }))
      );
    }
  }, [convexTodos]);

  // ✅ Responsive width
  const [isMobile, setIsMobile] = useState(
    Dimensions.get("window").width <= 375
  );
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsMobile(window.width <= 375);
    });
    return () => subscription?.remove();
  }, []);

  // ✅ Handlers
  const handleAddTodo = async () => {
    if (!text.trim()) return;
    await createTodo({ title: text.trim() });
    setText("");
  };

  const handleClearCompleted = async () => {
    const completedIds = localTodos.filter((t) => t.completed).map((t) => t.id);
    for (const id of completedIds) {
      await deleteTodo({ id });
    }
  };

  const handleToggle = async (id: Id<"todos">) => {
    await toggleTodo({ id });
  };

  const handleDelete = async (id: Id<"todos">) => {
    await deleteTodo({ id });
  };

  // ✅ Local reorder only (no Convex persistence)
  const handleReorder = (newOrder: Todo[]) => {
    setLocalTodos(newOrder);
  };

  return (
    <ThemedBackground>
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.header,
            {
              width: isMobile ? 324.32 : 541,
              marginTop: isMobile ? 48 : 70,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                letterSpacing: isMobile ? 9.71 : 15,
                fontSize: isMobile ? 25.9 : 40,
              },
            ]}
          >
            TODO
          </Text>
          <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
        </View>

        <TodoInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAddTodo}
          placeholder="Create a new todo..."
          theme={theme}
        />

        <TodoList
          todos={localTodos}
          theme={theme}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onClearCompleted={handleClearCompleted}
          onReorder={handleReorder}
        />
      </SafeAreaView>
    </ThemedBackground>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontFamily: "JosefinSans_700Bold",
  },
});
