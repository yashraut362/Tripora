import { KeyboardAvoidingView, Platform, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WIZARD_STEPS } from "@/lib/trip-data";

interface WizardScreenProps {
  step: number; // 1-based
  title: string;
  subtitle?: string;
  /** Animated illustration filling the area above the form sheet */
  hero: React.ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext: () => void;
  avoidKeyboard?: boolean;
  children: React.ReactNode;
}

export function WizardScreen({
  step,
  title,
  subtitle,
  hero,
  nextLabel = "Next",
  nextDisabled = false,
  onNext,
  avoidKeyboard = false,
  children,
}: WizardScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View className="flex-1">
      {/* Illustration stage — shrinks when the keyboard opens */}
      <View className="flex-1 overflow-hidden">{hero}</View>

      {/* Form sheet — sized to content so controls never get squeezed */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        className="rounded-t-[32px] border-t border-border/40 bg-card px-6 pt-7 shadow-lg shadow-black/10"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text className="text-xs font-bold uppercase tracking-[3px] text-primary">
            Step {step} of {WIZARD_STEPS.length}
          </Text>
          <Text variant="h2" className="mt-2 border-0 pb-0 font-extrabold">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="muted" className="mt-1">
              {subtitle}
            </Text>
          ) : null}
        </Animated.View>

        <View className="mb-6 mt-5">{children}</View>

        <Button
          size="lg"
          className="h-14 w-full rounded-full"
          disabled={nextDisabled}
          onPress={onNext}
        >
          <Text className="text-lg font-bold">{nextLabel}</Text>
        </Button>
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
