import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { SettingsItemProps } from './settings.types';
import { styles } from './settings.styles';
import { useSettingsContext } from '@/contexts/SetttingsContext';

/**
 * A component that renders a single settings item.
 *
 * @param {SettingsItemProps} props - The props for the SettingsItem component.
 * @returns {JSX.Element} The rendered SettingsItem component.
 */
export const SettingsItem = (props: SettingsItemProps) => {
  const { setting, options } = props;
  const { updateSetting } = useSettingsContext();

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleOptionSelect = async (option: string) => {
    await updateSetting(setting.label, option);
    setModalVisible(false);
  };

  return (
    <View>
    <TouchableOpacity style={styles.rowContainer} onPress={handlePress}>
      <Text style={styles.label}>{setting.label}</Text>
      <Text style={styles.value}>{setting.value}</Text>
    </TouchableOpacity>

    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>{setting.label}</Text>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => handleOptionSelect(item)}
                    >
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
    </View>
  );
};