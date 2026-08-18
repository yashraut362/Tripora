import { useEffect } from "react";
import {
  Easing,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

interface UseLoopOptions {
  duration: number;
  delay?: number;
  /** true (default) ping-pongs 0→1→0; false restarts from 0 each cycle */
  reverse?: boolean;
  linear?: boolean;
}

/** Shared value looping 0→1 forever. The building block for ambient hero motion. */
export function useLoop({
  duration,
  delay = 0,
  reverse = true,
  linear = false,
}: UseLoopOptions): SharedValue<number> {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration,
          easing: linear ? Easing.linear : Easing.inOut(Easing.sin),
        }),
        -1,
        reverse,
      ),
    );
  }, [t, duration, delay, reverse, linear]);

  return t;
}
