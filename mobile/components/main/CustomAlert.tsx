import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose: () => void;
}

export default function CustomAlert({ visible, title, message, buttons = [], onClose }: CustomAlertProps) {
  

  const defaultButtons: AlertButton[] = [{ text: 'OK', onPress: onClose, style: 'default' }];

  const alertButtons = buttons.length > 0 ? buttons : defaultButtons;

  // Determine icon based on title or buttons
  const getIcon = () => {
    if (title.toLowerCase().includes('error') || title.toLowerCase().includes('failed')) return 'alert-circle';
    if (title.toLowerCase().includes('success')) return 'checkmark-circle';
    if (buttons.some(b => b.style === 'destructive')) return 'warning';
    return 'information-circle';
  };

  const getIconColor = () => {
    if (title.toLowerCase().includes('error') || title.toLowerCase().includes('failed')) return '#EF4444';
    if (title.toLowerCase().includes('success')) return '#10B981';
    if (buttons.some(b => b.style === 'destructive')) return '#F59E0B';
    return '#3B82F6';
  };

return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-sm shadow-lg">
          
          <View className="items-center mb-4">
          </View>
          <Text className="text-white text-lg font-bold mb-2 text-center">{title}</Text>
          <Text className="text-gray-300 mb-6 text-center">{message}</Text>
          <View className="flex-row justify-center flex-wrap"> 
            {alertButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                className={`px-6 py-3 rounded-lg mx-2 mb-2 min-w-[100px] items-center justify-center ${
                  button.style === 'destructive'
                    ? 'bg-red-600'
                    : button.style === 'cancel'
                    ? 'bg-gray-600'
                    : 'bg-blue-600'
                }`}
                onPress={() => {
                  button.onPress?.();
                  onClose();
                }}
              >
                <Text className="text-white font-semibold text-center">{button.text || 'OK'}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </View>
    </Modal>
  );
}

// Utility function to show alert
let showAlert: (title: string, message: string, buttons?: CustomAlertProps['buttons']) => void;

export const setAlertHandler = (handler: typeof showAlert) => {
  showAlert = handler;
};

export const customAlert = (title: string, message: string, buttons?: CustomAlertProps['buttons']) => {
  if (showAlert) {
    showAlert(title, message, buttons);
  }
};