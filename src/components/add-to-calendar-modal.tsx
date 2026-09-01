import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import {
  CalendarBlank,
  CalendarPlus,
  Clock,
  MapPin,
  X,
} from "phosphor-react-native";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import type { ItineraryStop } from "@/lib/api";
import { useThemeColors } from "@/lib/theme";
import { mapsUrl } from "@/lib/utils";

const SLOT_HOURS = { Morning: 9, Afternoon: 14, Evening: 19 } as const;

const pad = (n: number) => String(n).padStart(2, "0");

function toCalDate(d: Date) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
    d.getHours(),
  )}${pad(d.getMinutes())}00`;
}

function defaultWhen(day: number, slot: ItineraryStop["slot"]) {
  const d = new Date();
  d.setDate(d.getDate() + day - 1);
  d.setHours(SLOT_HOURS[slot], 0, 0, 0);
  return d;
}

interface AddToCalendarModalProps {
  target: { stop: ItineraryStop; day: number };
  destination: string;
  onClose: () => void;
}

export function AddToCalendarModal({
  target,
  destination,
  onClose,
}: AddToCalendarModalProps) {
  const { stop, day } = target;
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState(stop.tips ?? stop.detail);
  const [when, setWhen] = useState(() => defaultWhen(day, stop.slot));
  const [picker, setPicker] = useState<"date" | "time" | null>(null);

  const openPicker = (mode: "date" | "time") => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: when,
        mode,
        onChange: (event, selected) => {
          if (event.type === "set" && selected) setWhen(selected);
        },
      });
    } else {
      setPicker((current) => (current === mode ? null : mode));
    }
  };

  const addToCalendar = () => {
    const end = new Date(when.getTime() + 2 * 60 * 60 * 1000);
    const details = `${notes.trim()}\n\nMap: ${mapsUrl(stop.mapsQuery, destination)}`;
    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(`${stop.title} — ${destination}`)}` +
      `&dates=${toCalDate(when)}/${toCalDate(end)}` +
      `&details=${encodeURIComponent(details)}` +
      `&location=${encodeURIComponent(`${stop.mapsQuery}, ${destination}`)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Couldn't open calendar", "Please try again."),
    );
    onClose();
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
          <Pressable
            className="rounded-t-[28px] bg-background px-6 pt-5"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text variant="eyebrow">
                  Day {day} · {stop.slot}
                </Text>
                <Text variant="h3" className="mt-1">
                  {stop.title}
                </Text>
              </View>
              <ScalePressable
                onPress={onClose}
                hitSlop={8}
                className="h-9 w-9 items-center justify-center rounded-full bg-card"
              >
                <X size={16} weight="bold" color={colors.foreground} />
              </ScalePressable>
            </View>

            <View className="mt-4 flex-row gap-3">
              <ScalePressable
                onPress={() => openPicker("date")}
                hitSlop={4}
                className="flex-row items-center gap-2 rounded-full bg-card px-4 py-3"
              >
                <CalendarBlank size={16} weight="fill" color={colors.primary} />
                <Text className="font-sans-semibold text-sm text-foreground">
                  {when.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </ScalePressable>
              <ScalePressable
                onPress={() => openPicker("time")}
                hitSlop={4}
                className="flex-row items-center gap-2 rounded-full bg-card px-4 py-3"
              >
                <Clock size={16} weight="fill" color={colors.primary} />
                <Text className="font-sans-semibold text-sm text-foreground">
                  {when.toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Text>
              </ScalePressable>
            </View>

            {picker ? (
              <DateTimePicker
                value={when}
                mode={picker}
                display="spinner"
                onChange={(_, selected) => {
                  if (selected) setWhen(selected);
                }}
              />
            ) : null}

            <Text variant="eyebrow" className="mb-2 mt-5">
              Notes
            </Text>
            <Input
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              placeholder="Anything to carry or book ahead…"
              className="h-auto min-h-[96px] rounded-[20px] py-3 text-sm leading-5"
            />

            <ScalePressable
              onPress={() =>
                Linking.openURL(mapsUrl(stop.mapsQuery, destination))
              }
              hitSlop={6}
              className="mt-3 flex-row items-center gap-2"
            >
              <MapPin size={14} weight="fill" color={colors.primary} />
              <Text
                numberOfLines={1}
                className="flex-shrink font-sans-medium text-xs text-muted-foreground"
              >
                {stop.mapsQuery}
              </Text>
            </ScalePressable>

            <ScalePressable
              onPress={addToCalendar}
              className="mt-5 h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"
            >
              <CalendarPlus
                size={18}
                weight="fill"
                color={colors.primaryForeground}
              />
              <Text className="font-sans-bold text-base text-primary-foreground">
                Add to calendar
              </Text>
            </ScalePressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
