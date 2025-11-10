// app/(tabs)/generator.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Pressable, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- IMPORT KOMPONENTÓW ---
import FilterButton from '../components/ui/FilterButton';

// --- IMPORT STAŁYCH ---
import { Colors } from '../constants/colors';
import { FontSizes, FontWeights, FontFamilies } from "../constants/fonts";
import { Spacing, Border } from '../constants/layout';

// --- DANE ---
import { PROPOZYCJE_RANDEK } from '../datagenerator';

type FilterGroup = 'where' | 'activity' | 'time' | 'budget' | 'season';

interface FiltersState {
  where: string;
  activity: string;
  time: string;
  budget: string;
  season: string;
}

export default function GeneratorScreen() {
  const [filters, setFilters] = useState<FiltersState>({
    where: '',
    activity: '',
    time: '',
    budget: '',
    season: '',
  });

  const [selectedDate, setSelectedDate] = useState<any>(null); // 🔹 Randka do wyświetlenia w modalu
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Nowa logika losowania z uwzględnieniem "Dowolna"
  const handleGenerateDate = () => {
    const matchingDates = PROPOZYCJE_RANDEK.filter(r => {
      return Object.entries(filters).every(([key, value]) => {
        const randkaFiltry = r.filtry[key as keyof typeof r.filtry];
        // Jeśli filtr nie jest wybrany → OK
        if (value === '') return true;
        // Jeśli randka ma "Dowolna" → OK
        if (randkaFiltry.includes('Dowolna')) return true;
        // W innym wypadku: czy zawiera wartość filtra
        return randkaFiltry.includes(value);
      });
    });

    if (matchingDates.length === 0) {
      setSelectedDate({
        nazwa: 'Brak dopasowań',
        opis: 'Nie znaleziono randki dla wybranych filtrów. Spróbuj zmienić ustawienia!',
      });
      setModalVisible(true);
      return;
    }

    const random = matchingDates[Math.floor(Math.random() * matchingDates.length)];
    setSelectedDate(random);
    setModalVisible(true);
  };

  const handleFilterPress = (group: FilterGroup, value: string) => {
    setFilters(prev => ({
      ...prev,
      [group]: prev[group] === value ? '' : value,
    }));
  };

  const FilterSection = ({ title, group, options }: { title: string; group: FilterGroup; options: string[] }) => (
    <View style={styles.filterSection as ViewStyle}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterOptionsContainer as ViewStyle}>
        {options.map(option => (
          <FilterButton
            key={option}
            label={option}
            isSelected={filters[group] === option}
            onPress={() => handleFilterPress(group, option)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]} style={styles.container as ViewStyle}>
      <ScrollView contentContainerStyle={styles.scrollContent as ViewStyle}>
        <Image source={require("../assets/images/serca.png")} style={styles.icon} />
        <Text
            style={{
              fontFamily: FontFamilies.heading,
              fontSize: FontSizes.h1,
              textAlign: 'center',
            }}
          >
          
          Wyzwanie Randkowe</Text>

        <Text style={styles.filtersLabel}>FILTRY</Text>
        <Text style={styles.filtersLabel}>
          Jeśli chcesz, możesz wybrać filtry, aby randka była lepiej dopasowana lub zdaj się na losowość.
        </Text>

        <View style={styles.filtersContainer as ViewStyle}>
          <FilterSection title="Gdzie:" group="where" options={['W domu', 'Na zewnątrz']} />
          <FilterSection title="Aktywność:" group="activity" options={['Aktywnie', 'Leniwie']} />
          <FilterSection title="Czas:" group="time" options={['Mało czasu', 'Dużo czasu']} />
          <FilterSection title="Budżet:" group="budget" options={['Mały budżet', 'Duży budżet']} />
          <FilterSection title="Pora roku:" group="season" options={['Wiosna', 'Lato', 'Jesień', 'Zima']} />
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateDate}>
          <LinearGradient
            colors={[Colors.accentPink, '#FFD7E4']}
            style={styles.generateButtonGradient as ViewStyle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.generateButtonText}>LOSUJ RANDKĘ!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔹 MODAL PO WYLOSOWANIU RANDKI */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDate?.nazwa}</Text>
            <Text style={styles.modalDescription}>{selectedDate?.opis}</Text>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// --- STYLY ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: Spacing.xxl * 1.5,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxl * 2,
    alignItems: 'center',
  },
  appName: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginBottom: Spacing.large,
  },
  filtersLabel: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.small,
    marginBottom: Spacing.small,
  },
  filtersContainer: {
    width: '100%',
    padding: Spacing.large,
    backgroundColor: Colors.backgroundTransparent,
    borderRadius: Border.radius,
    marginBottom: Spacing.small,
  },
  filterSection: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    borderBottomColor: Colors.borderColor,
  },
  filterTitle: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  generateButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginTop: Spacing.small,
    shadowColor: Colors.accentPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  generateButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // 🔹 Styl dla modala
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.accentPink,
    borderRadius: 8,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
    headerContainer: {
    flexDirection: "row",   // obrazek i tekst w jednej linii
    alignItems: "center",   // wyrównanie w pionie
    justifyContent: "center",
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 8, // odstęp między sercami a tekstem
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.h1,
    color: "#333",
  },
});
