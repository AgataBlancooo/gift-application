// app/components/ui/FilterButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Colors } from '../../constants/colors'; 
import { FontSizes, FontWeights } from '../../constants/fonts';
import { Spacing, Border } from '../../constants/layout';

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected ? styles.selectedButton : styles.unselectedButton,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isSelected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.medium,
    borderRadius: Border.radiusSmall,
    marginRight: Spacing.small,
    marginBottom: Spacing.small,
  },
  unselectedButton: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.borderColor,
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: Colors.accentGreen, // Używamy zielonego akcentu dla wybranych filtrów
  },
  text: {
    fontSize: 12,
    fontWeight: FontWeights.semiBold,
  },
  unselectedText: {
    color: Colors.textSecondary,
  },
  selectedText: {
    color: Colors.textPrimary, // Lub Biały/Ciemny tekst, w zależności od koloru akcentu
  },
});

export default FilterButton;