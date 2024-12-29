import { Key } from "react";
import { View, Text } from "react-native";
import { styles } from "./settings.styles";
import { Setting } from "./settings.types";
import { SettingsItem } from "./SettingsItem";
import { useSettingsContext } from "@/contexts/SetttingsContext";

/**
 * A component that renders a list of settings.
 *
 * @param {SettingsListProps} props - The props for the SettingsList component.
 * @returns {JSX.Element} The rendered SettingsList component.
 */
export const SettingsList = () => {
    const { headerSettings } = useSettingsContext();
    return (
        <View style={styles.container}>
            {headerSettings.map((headerSetting, headerIndex) => (
                <View key={headerIndex} style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>{headerSetting.header}</Text>
                    {headerSetting.settings.map((setting: Setting, settingIndex: Key) => (
                        <SettingsItem
                            key={settingIndex}
                            setting={setting}
                            options={setting.options}
                        />
                    ))}
                </View>
            ))}
        </View>
    );

}