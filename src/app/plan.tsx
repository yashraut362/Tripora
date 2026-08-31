import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, CaretLeft } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivitiesStep } from "@/components/form/activities-step";
import { BudgetStep } from "@/components/form/budget-step";
import { DaysStep } from "@/components/form/days-step";
import { DestinationStep } from "@/components/form/destination-step";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import type { TripDetail, TripSelections } from "@/lib/api";
import { useThemeColors } from "@/lib/theme";
import { DEFAULT_BUDGET, DEFAULT_DAYS } from "@/lib/trip-data";
import { cn } from "@/lib/utils";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

const STEPS = [
  {
    eyebrow: "Destination",
    title: "Where to?",
    subtitle:
      "A city, an island, a country — anywhere you've been meaning to go.",
  },
  {
    eyebrow: "Duration",
    title: "How long?",
    subtitle: "You can always stretch it later.",
  },
  {
    eyebrow: "Budget",
    title: "And the budget?",
    subtitle:
      "Total for the whole trip, in US dollars — it keeps the plan afloat.",
  },
  {
    eyebrow: "Activities",
    title: "What are you into?",
    subtitle: "Pick as many as you like.",
  },
];

export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const editing = Boolean(id);

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [budget, setBudget] = useState<number | null>(DEFAULT_BUDGET);
  const [activities, setActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  const progress = useSharedValue(1 / STEPS.length);

  useEffect(() => {
    progress.value = withTiming((step + 1) / STEPS.length, {
      duration: 650,
      easing: EASE,
    });
  }, [step, progress]);

  useEffect(() => {
    if (!id) return;
    api<TripDetail>(`/api/trips/${id}`)
      .then((trip) => {
        setDestination(trip.destination);
        setDays(trip.days);
        setBudget(trip.budget);
        setActivities(trip.activities);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Couldn't load trip", "Please try again.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      });
  }, [id]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const stepDisabled =
    (step === 0 && destination.trim().length === 0) ||
    (step === 2 && (budget === null || budget <= 0)) ||
    (step === 3 && activities.length === 0);

  const ctaLabel = saving
    ? "Saving…"
    : !isLast
      ? "Continue"
      : editing
        ? "Save changes"
        : "Finish";

  const goBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const goNext = () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    const body: TripSelections = {
      destination: destination.trim(),
      days,
      budget,
      activities,
    };
    setSaving(true);
    const save = editing
      ? api<TripDetail>(`/api/trips/${id}`, { method: "PUT", body })
      : api<TripDetail>("/api/trips", { method: "POST", body });
    save
      .then(() => router.back())
      .catch(() =>
        Alert.alert("Couldn't save trip", "Check your connection and try again."),
      )
      .finally(() => setSaving(false));
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        className="flex-1 overflow-hidden bg-background"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center gap-4 px-6 py-3">
          <Pressable
            onPress={goBack}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-card active:bg-muted"
          >
            <CaretLeft size={18} weight="bold" color={colors.foreground} />
          </Pressable>

          <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <Animated.View
              style={[barStyle, { transformOrigin: "left" }]}
              className="h-full w-full rounded-full bg-primary"
            />
          </View>

          <Text className="font-sans-semibold text-[11px] tracking-[2px] text-muted-foreground">
            {String(step + 1).padStart(2, "0")} / 0{STEPS.length}
          </Text>
        </View>

        <View className="flex-1 px-6">
          <View
            pointerEvents="none"
            className="absolute -right-16 -top-14 h-44 w-44 rounded-full bg-secondary/70"
          />
          <View
            pointerEvents="none"
            className="absolute right-16 top-16 h-14 w-14 rounded-full bg-primary/15"
          />

          <Animated.View
            key={`head-${step}`}
            entering={FadeInUp.duration(650).easing(EASE)}
            className="mt-5"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-1.5 w-8 rounded-full bg-primary" />
              <Text variant="eyebrow">{current.eyebrow}</Text>
            </View>
            <Text variant="h1" className="mt-4">
              {current.title}
            </Text>
            <Text className="mt-3 font-sans text-base leading-6 text-muted-foreground">
              {current.subtitle}
            </Text>
          </Animated.View>

          <Animated.View
            key={`step-${step}`}
            entering={FadeInUp.delay(120).duration(650).easing(EASE)}
            className="mt-10 flex-1"
          >
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : step === 0 ? (
              <DestinationStep value={destination} onChange={setDestination} />
            ) : step === 1 ? (
              <DaysStep value={days} onChange={setDays} />
            ) : step === 2 ? (
              <BudgetStep value={budget} onChange={setBudget} />
            ) : (
              <ActivitiesStep value={activities} onChange={setActivities} />
            )}
          </Animated.View>

          <View style={{ paddingBottom: insets.bottom + 12 }}>
            <ScalePressable
              disabled={stepDisabled || saving || loading}
              onPress={goNext}
              className={cn(
                "h-16 flex-row items-center justify-between rounded-full bg-primary pl-7 pr-2",
                (stepDisabled || saving || loading) && "opacity-30",
              )}
            >
              <Text className="font-sans-bold text-base tracking-wide text-primary-foreground">
                {ctaLabel}
              </Text>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/25">
                <ArrowRight
                  size={20}
                  weight="bold"
                  color={colors.primaryForeground}
                />
              </View>
            </ScalePressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
