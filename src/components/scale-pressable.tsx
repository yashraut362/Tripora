import { Pressable, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface ScalePressableProps extends Omit<PressableProps, "children"> {
  className?: string;
  /** Scale applied while pressed. */
  scaleTo?: number;
  children?: React.ReactNode;
}

/**
 * Pressable with spring press physics — the surface settles to `scaleTo`
 * on touch-down and springs back on release. Style the inner surface via
 * `className`; the outer Pressable stays layout-neutral.
 */
export function ScalePressable({
  className,
  scaleTo = 0.97,
  children,
  onPressIn,
  onPressOut,
  ...props
}: ScalePressableProps) {
  const pressed = useSharedValue(0);

  const surface = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pressed.value * (scaleTo - 1) }],
  }));

  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        pressed.value = withSpring(1, { damping: 20, stiffness: 400 });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.value = withSpring(0, { damping: 16, stiffness: 300 });
        onPressOut?.(event);
      }}
    >
      <Animated.View style={surface} className={className}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
