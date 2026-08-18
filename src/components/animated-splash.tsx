import { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

const BLUE = "#208AEF";
const RING_RADIUS = 104;
const RING_SIZE = RING_RADIUS * 2;
const DOT_COUNT = 14;
const DOT_SIZE = 8;

// Start at the top of the ring (12 o'clock)
const START_ANGLE = -90;

// Hardcoded so the barcode is stable across renders
const BARCODE_BARS = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 5, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3];

function OrbitDot({
  index,
  orbit,
  converge,
}: {
  index: number;
  orbit: SharedValue<number>;
  converge: SharedValue<number>;
}) {
  const angle = ((START_ANGLE + (index / DOT_COUNT) * 360) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  // The plane reveals this dot as it passes this fraction of the orbit
  const reveal = index / DOT_COUNT;

  const style = useAnimatedStyle(() => ({
    opacity:
      interpolate(orbit.value, [reveal, reveal + 0.05], [0, 1], "clamp") *
      interpolate(converge.value, [0, 0.85, 1], [1, 1, 0]) *
      (index % 2 === 0 ? 0.95 : 0.55),
    transform: [
      // Pull radially toward the ring center as converge goes 0 -> 1
      { translateX: -cos * RING_RADIUS * converge.value },
      { translateY: -sin * RING_RADIUS * converge.value },
      { scale: interpolate(converge.value, [0, 1], [1, 0.4]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: RING_RADIUS + cos * RING_RADIUS - DOT_SIZE / 2,
          top: RING_RADIUS + sin * RING_RADIUS - DOT_SIZE / 2,
        },
        style,
      ]}
    />
  );
}

function OrbitPlane({
  orbit,
  converge,
}: {
  orbit: SharedValue<number>;
  converge: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const deg = START_ANGLE + orbit.value * 360;
    const rad = (deg * Math.PI) / 180;
    return {
      opacity: interpolate(converge.value, [0, 0.5], [1, 0], "clamp"),
      transform: [
        { translateX: Math.cos(rad) * RING_RADIUS },
        { translateY: Math.sin(rad) * RING_RADIUS },
        // Face along the direction of travel (tangent to the ring)
        { rotate: `${deg + 90}deg` },
      ],
    };
  });

  return <Animated.Text style={[styles.plane, style]}>✈️</Animated.Text>;
}

export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const orbit = useSharedValue(0);
  const converge = useSharedValue(0);
  const pin = useSharedValue(0);
  const ripple = useSharedValue(0);
  const fade = useSharedValue(1);
  const scale = useSharedValue(1);
  const doneRef = useRef(false);

  useEffect(() => {
    // Native (static) splash hands off to this animated one
    SplashScreen.hideAsync().catch(() => {});

    orbit.value = withTiming(1, {
      duration: 1200,
      easing: Easing.inOut(Easing.quad),
    });
    converge.value = withDelay(
      1350,
      withTiming(1, { duration: 400, easing: Easing.in(Easing.quad) }),
    );
    pin.value = withDelay(1700, withSpring(1, { damping: 12, stiffness: 180 }));
    ripple.value = withDelay(
      2000,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }),
    );
  }, [orbit, converge, pin, ripple]);

  const exit = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    scale.value = withTiming(1.06, { duration: 400, easing: Easing.out(Easing.quad) });
    fade.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) }, () => {
      runOnJS(onFinish)();
    });
  }, [fade, scale, onFinish]);

  useEffect(() => {
    const timer = setTimeout(exit, 3200);
    return () => clearTimeout(timer);
  }, [exit]);

  const container = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
  }));

  const pinStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pin.value, [0, 0.2], [0, 1], "clamp"),
    transform: [{ translateY: interpolate(pin.value, [0, 1], [-140, 0]) }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ripple.value, [0, 0.05, 1], [0, 0.5, 0]),
    transform: [{ scale: interpolate(ripple.value, [0, 1], [0.4, 2.2]) }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, container]}>
      {/* Tap anywhere to skip */}
      <Pressable style={[StyleSheet.absoluteFill, styles.center]} onPress={exit}>
        <View style={styles.globe} pointerEvents="none">
          <View style={styles.ringLayer}>
            {Array.from({ length: DOT_COUNT }).map((_, i) => (
              <OrbitDot key={i} index={i} orbit={orbit} converge={converge} />
            ))}
          </View>

          <Animated.View style={[styles.ripple, rippleStyle]} />

          <Animated.View style={[styles.pin, pinStyle]}>
            <View style={styles.pinBody}>
              <View style={styles.pinDot} />
            </View>
          </Animated.View>

          <OrbitPlane orbit={orbit} converge={converge} />
        </View>

        <Animated.Text
          entering={FadeInUp.delay(2200).duration(450)}
          style={styles.wordmark}
        >
          TRIPORA
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(2500).duration(400)}
          style={styles.tagline}
        >
          your ai travel planner
        </Animated.Text>

        <Animated.View
          entering={FadeIn.delay(2500).duration(500)}
          style={styles.ticketFooter}
          pointerEvents="none"
        >
          <View style={styles.perforation}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View key={i} style={styles.perforationHole} />
            ))}
          </View>
          <View style={styles.barcode}>
            {BARCODE_BARS.map((w, i) => (
              <View key={i} style={[styles.bar, { width: w * 1.5 }]} />
            ))}
          </View>
          <Animated.Text style={styles.footerText}>TRP-0001 · BOARDING</Animated.Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 999,
    backgroundColor: BLUE,
    overflow: "hidden",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  globe: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  ringLayer: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#FFFFFF",
  },
  plane: {
    position: "absolute",
    fontSize: 24,
  },
  ripple: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  pin: {
    alignItems: "center",
  },
  pinBody: {
    width: 44,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: BLUE,
  },
  wordmark: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 6,
  },
  tagline: {
    marginTop: 12,
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    letterSpacing: 3,
  },
  ticketFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: "center",
  },
  perforation: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    marginBottom: 20,
  },
  perforationHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  barcode: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 28,
  },
  bar: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  footerText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    letterSpacing: 4,
  },
});
