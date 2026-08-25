import { Tabs } from "expo-router";
import { House, MapTrifold, type Icon } from "phosphor-react-native";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

const TAB_META: Record<string, { label: string; icon: Icon }> = {
  index: { label: "Home", icon: House },
  map: { label: "Map", icon: MapTrifold },
};

type TabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

function FloatingTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: insets.bottom + 12,
        alignItems: "center",
      }}
    >
      <View
        className="h-16 flex-row items-center gap-1 rounded-full bg-foreground px-2"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const TabIcon = meta.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return focused ? (
            <ScalePressable
              key={route.key}
              onPress={onPress}
              className="h-12 flex-row items-center gap-2 rounded-full bg-primary px-6"
            >
              <TabIcon size={20} weight="fill" color={colors.primaryForeground} />
              <Text className="font-sans-bold text-sm text-primary-foreground">
                {meta.label}
              </Text>
            </ScalePressable>
          ) : (
            <ScalePressable
              key={route.key}
              onPress={onPress}
              hitSlop={6}
              className="h-12 w-12 items-center justify-center rounded-full"
            >
              <TabIcon size={22} weight="bold" color={colors.background} />
            </ScalePressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
    </Tabs>
  );
}
