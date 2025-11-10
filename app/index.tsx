import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "./constants/colors"; // 
import { FontSizes, FontWeights, FontFamilies } from "./constants/fonts";

export default function HomeScreen() {
  const router = useRouter();

  return (
    
    <View style={styles.container}>
      <Image source={require("./assets/images/serca.png")} style={styles.icon} />
            <Text
          style={{
            fontFamily: FontFamilies.heading,
            fontSize: FontSizes.h1,
            textAlign: 'center',
          }}
        >
        Witaj w naszej aplikacji</Text>
      <Text style={styles.subtitle}>Wybierz, dokąd chcesz przejść:</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/dates")}
        >
          <FontAwesome name="calendar" size={18} color={Colors.textLight} />
          <Text style={styles.buttonText}>Nasze Daty</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/generator")}
        >
          <FontAwesome name="diamond" size={18} color={Colors.textLight} />
          <Text style={styles.buttonText}>Randki</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/travelalbum")}
        >
          <FontAwesome name="globe" size={18} color={Colors.textLight} />
          <Text style={styles.buttonText}>Podróże</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/zaik")}
        >
          <FontAwesome name="lock" size={18} color={Colors.textLight} />
          <Text style={styles.buttonText}>ZAiK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.textAccent,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 30,
    textAlign: "center",
  },
  buttons: {
    width: "100%",
    alignItems: "center",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accentPink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "80%",
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
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

});
