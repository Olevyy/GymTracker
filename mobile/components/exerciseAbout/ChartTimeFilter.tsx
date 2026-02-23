import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type TimeFilterType = '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface Props {
    selected: TimeFilterType;
    onSelect: (value: TimeFilterType) => void;
}

export default function ChartTimeFilter({ selected, onSelect }: Props) {
    const options: TimeFilterType[] = ['1M', '3M', '6M', '1Y', 'ALL'];

    return (
        <View className="flex-row justify-between bg-gray-900 rounded-lg p-1 mb-4 border border-gray-800 mx-1">
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    onPress={() => onSelect(option)}
                    className={`flex-1 py-1.5 items-center rounded-md ${selected === option ? 'bg-blue-600' : 'bg-transparent'}`}
                >
                    <Text className={`font-bold text-xs ${selected === option ? 'text-white' : 'text-gray-400'}`}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}