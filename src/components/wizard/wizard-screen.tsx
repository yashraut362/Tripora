import { ArrowRight } from "phosphor-react-native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

export const enterFrom = (delay: number) =>
  FadeInUp.delay(delay).duration(650).easing(EASE);

interface WizardScreenProps {
  step: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext: () => void;
  avoidKeyboard?: boolean;
  children: React.ReactNode;
}

export function WizardScreen({
  step,
  eyebrow,
  title,
  subtitle,
  nextLabel = "Continue",
  nextDisabled = false,
  onNext,
  avoidKeyboard = false,
  children,
}: WizardScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const content = (
    <View className="flex-1 overflow-hidden bg-background px-6">
      <View
        pointerEvents="none"
        className="absolute -right-16 -top-14 h-44 w-44 rounded-full bg-secondary/70"
      />
      <View
        pointerEvents="none"
        className="absolute right-16 top-16 h-14 w-14 rounded-full bg-primary/15"
      />

      <Animated.View entering={enterFrom(0)} className="mt-8">
        <View className="flex-row items-center gap-3">
          <View className="h-1.5 w-8 rounded-full bg-primary" />
          <Text variant="eyebrow">{eyebrow}</Text>
        </View>
        <Text variant="h1" className="mt-4">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-3 font-sans text-base leading-6 text-muted-foreground">
            {subtitle}
          </Text>
        ) : null}
      </Animated.View>

      <Animated.View entering={enterFrom(120)} className="mt-10 flex-1">
        {children}
      </Animated.View>

      <Animated.View
        entering={enterFrom(220)}
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <ScalePressable
          disabled={nextDisabled}
          onPress={onNext}
          className={cn(
            "h-16 flex-row items-center justify-between rounded-full bg-primary pl-7 pr-2",
            nextDisabled && "opacity-30",
          )}
        >
          <Text className="font-sans-bold text-base tracking-wide text-primary-foreground">
            {nextLabel}
          </Text>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/25">
            <ArrowRight size={20} weight="bold" color={colors.primaryForeground} />
          </View>
        </ScalePressable>
      </Animated.View>
    </View>
  );

  if (!avoidKeyboard) {
    return content;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}
