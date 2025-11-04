import React from "react";
import {
  View,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";

const AnimatedImage = Animated.createAnimatedComponent(Animated.Image);

export default function ThemedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = Dimensions.get("window");
  const isMobile = width <= 375;
  const { theme } = useTheme();
  const opacity = useSharedValue(1);
  const [displayedImage, setDisplayedImage] =
    React.useState<ImageSourcePropType>(theme.backgroundimage);

  React.useEffect(() => {
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setDisplayedImage)(theme.backgroundimage);
        opacity.value = withTiming(1, { duration: 350 });
      }
    });
  }, [theme.backgroundimage]);

  const ImageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <Animated.View
        style={[styles.backgroundLayer, { backgroundColor: theme.background }]}
      />
      <AnimatedImage
        source={displayedImage}
        style={[
          styles.image,
          ImageStyle,
          {
            height: isMobile ? 200 : 300,
          },
        ]}
      />

      {/* Content Layer */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    zIndex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
    position: "relative",
  },
});
