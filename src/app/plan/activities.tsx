import { router } from "expo-router";
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Text } from "@/components/ui/text";
import { ActivitiesHero } from "@/components/wizard/hero-activities";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { ACTIVITIES } from "@/lib/trip-data";
import { useTripStore } from "@/stores/trip-store";

export default function ActivitiesScreen() {
  const activities = useTripStore((s) => s.activities);
  const setActivities = useTripStore((s) => s.setActivities);
  const saveTrip = useTripStore((s) => s.saveTrip);
  const editing = useTripStore((s) => s.editingTripId !== null);

  const finish = () => {
    saveTrip();
    router.dismissTo("/");
  };

  return (
    <WizardScreen
      step={4}
      title="What do you love doing?"
      subtitle="Pick as many as you like."
      hero={<ActivitiesHero selected={activities} />}
      nextLabel={editing ? "Save changes" : "Finish"}
      nextDisabled={activities.length === 0}
      onNext={finish}
    >
      <ToggleGroup
        type="multiple"
        variant="outline"
        value={activities}
        onValueChange={setActivities}
        className="flex-row flex-wrap justify-start gap-2 rounded-none shadow-none"
      >
        {ACTIVITIES.map((activity) => (
          <ToggleGroupItem
            key={activity.id}
            value={activity.id}
            className="rounded-full border px-4"
          >
            <ToggleGroupIcon as={activity.icon} />
            <Text>{activity.label}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </WizardScreen>
  );
}
