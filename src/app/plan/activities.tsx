import { Image } from "expo-image";
import { router } from "expo-router";
import { Check } from "phosphor-react-native";
import { ScrollView, View } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { useThemeColors } from "@/lib/theme";
import { ACTIVITIES } from "@/lib/trip-data";
import { useTripStore } from "@/stores/trip-store";
import { cn } from "@/lib/utils";

export default function ActivitiesScreen() {
  const activities = useTripStore((s) => s.activities);
  const setActivities = useTripStore((s) => s.setActivities);
  const saveTrip = useTripStore((s) => s.saveTrip);
  const editing = useTripStore((s) => s.editingTripId !== null);
  const colors = useThemeColors();

  const toggle = (id: string) =>
    setActivities(
      activities.includes(id)
        ? activities.filter((a) => a !== id)
        : [...activities, id],
    );

  const finish = () => {
    saveTrip();
    router.dismissTo("/");
  };

  return (
    <WizardScreen
      step={4}
      eyebrow="Activities"
      title="What are you into?"
      subtitle="Pick as many as you like."
      nextLabel={editing ? "Save changes" : "Finish"}
      nextDisabled={activities.length === 0}
      onNext={finish}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-row flex-wrap justify-between pb-2"
      >
        {ACTIVITIES.map((activity) => {
          const selected = activities.includes(activity.id);
          return (
            <ScalePressable
              key={activity.id}
              onPress={() => toggle(activity.id)}
              style={{ width: "48%" }}
              className={cn(
                "mb-3 w-full items-center rounded-[24px] border-2 py-4",
                selected
                  ? "border-primary bg-primary/10"
                  : "border-transparent bg-card",
              )}
            >
              {selected ? (
                <View className="absolute right-3 top-3 h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check size={13} weight="bold" color={colors.primaryForeground} />
                </View>
              ) : null}
              <Image
                source={activity.image}
                style={{ width: 64, height: 64 }}
                contentFit="contain"
                transition={100}
              />
              <Text className="mt-2 font-sans-semibold text-sm text-foreground">
                {activity.label}
              </Text>
            </ScalePressable>
          );
        })}
      </ScrollView>
    </WizardScreen>
  );
}
