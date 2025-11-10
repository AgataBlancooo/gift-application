import React from 'react';
import { Tabs } from 'expo-router';
// Importujemy ikonę z biblioteki Font Awesome
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Funkcja pomocnicza do renderowania ikon
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  
  // W przyszłości możesz tutaj zaimportować kolory z Twojego Colors.js
  const primaryColor = '#FF69B4'; // Przykładowy róż

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor, 
        tabBarInactiveTintColor: '#999', 
        headerShown: false, // Ukrywamy domyślne nagłówki
      }}
    >
      {/* KARTA 1: DATY */}
      <Tabs.Screen
        name="dates" // Pasuje do pliku dates.tsx
        options={{
          title: 'Nasze Daty',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      
      {/* KARTA 2: GENERATOR RANDEK */}
      <Tabs.Screen
        name="generator" // Pasuje do pliku generator.tsx
        options={{
          title: 'Randki',
          tabBarIcon: ({ color }) => <TabBarIcon name="diamond" color={color} />, // Ikonka 'diament' lub 'magic'
        }}
      />
      
      {/* KARTA 3: ALBUM Z PODRÓŻY */}
      <Tabs.Screen
        name="travelalbum" // Pasuje do pliku travelalbum.tsx
        options={{
          title: 'Podróże',
          tabBarIcon: ({ color }) => <TabBarIcon name="globe" color={color} />, // Ikonka 'globus' lub 'mapa'
        }}
      />
      
      {/* KARTA 4: ZAiK (Zadania/Tajemnice) */}
      <Tabs.Screen
        name="zaik" // Pasuje do pliku zaik.tsx
        options={{
          title: 'ZAiK',
          tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />, // Ikonka 'kłódka' dla tajemnicy
        }}
      />
      
    </Tabs>
  );
}