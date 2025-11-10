import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { db, authenticate } from "../config/firebaseConfig";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";

import { Colors } from "../constants/colors";
import { FontSizes, FontWeights, FontFamilies } from "../constants/fonts";
import { Spacing, Border } from "../constants/layout";

const Checkbox = ({
  isCompleted,
  label,
  onRemove,
}: {
  isCompleted: boolean;
  label: string;
  onRemove: () => void;
}) => (
  <View style={checkboxStyles.taskItem as ViewStyle}>
    <View style={checkboxStyles.iconContainer}>
      <FontAwesome
        name={isCompleted ? "check-circle" : "circle-o"}
        size={FontSizes.large}
        color={isCompleted ? Colors.accentGreen : Colors.iconColorInactive}
      />
    </View>
    <Text style={checkboxStyles.taskLabel}>{label}</Text>
    <TouchableOpacity onPress={onRemove}>
      <FontAwesome
        name="trash"
        size={16}
        color={Colors.iconColorInactive}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  </View>
);

export default function ZaikScreen() {
  const [agataTasks, setAgataTasks] = useState<{ id: string; label: string }[]>([]);
  const [krzysztofTasks, setKrzysztofTasks] = useState<{ id: string; label: string }[]>([]);
  const [newTaskA, setNewTaskA] = useState("");
  const [newTaskK, setNewTaskK] = useState("");

  useEffect(() => {
    const init = async () => {
      await authenticate();

      const agataCol = collection(db, "agataTasks");
      const krzysztofCol = collection(db, "krzysztofTasks");

      const unsubscribeA = onSnapshot(agataCol, snapshot => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, label: doc.data().label }));
        setAgataTasks(tasks);
      });

      const unsubscribeK = onSnapshot(krzysztofCol, snapshot => {
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, label: doc.data().label }));
        setKrzysztofTasks(tasks);
      });

      return () => {
        unsubscribeA();
        unsubscribeK();
      };
    };

    init();
  }, []);

  const addTask = async (who: "A" | "K") => {
    if (who === "A" && newTaskA.trim() !== "") {
      await addDoc(collection(db, "agataTasks"), { label: newTaskA.trim() });
      setNewTaskA("");
    }
    if (who === "K" && newTaskK.trim() !== "") {
      await addDoc(collection(db, "krzysztofTasks"), { label: newTaskK.trim() });
      setNewTaskK("");
    }
  };

  const removeTask = async (who: "A" | "K", id: string) => {
    const collectionName = who === "A" ? "agataTasks" : "krzysztofTasks";
    await deleteDoc(doc(db, collectionName, id));
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.container as ViewStyle}
    >
      <ScrollView contentContainerStyle={styles.scrollContent as ViewStyle}>
        <Image source={require("../assets/images/serca.png")} style={styles.icon} />
        <Text
          style={{
            fontFamily: FontFamilies.heading,
            fontSize: FontSizes.h1,
            textAlign: 'center',
          }}
        >
          ZAIK
        </Text>

        <View style={styles.cardBox as ViewStyle}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/ZAIK.jpg")}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.cardText}>
            Celem tego arkusza jest bardziej efektywna i wspólna praca nad naszą relacją. Podjęcie tego wysiłku nie będzie łatwe ze względu na kontrast pomiędzy kobiecą i męską energią, ale warto go wykonać. Nasza miłość zasługuje na wspaniały dom - czyli naszą relację!
          </Text>
        </View>

        <View style={styles.tasksContainer as ViewStyle}>
          {/* --- Agata --- */}
          <View style={styles.column as ViewStyle}>
            <Text style={styles.columnTitle}>Zadania dla Agaty</Text>
            {agataTasks.map((task) => (
              <Checkbox
                key={task.id}
                isCompleted={false}
                label={task.label}
                onRemove={() => removeTask("A", task.id)}
              />
            ))}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newTaskA}
                onChangeText={setNewTaskA}
                placeholder="Nowe zadanie..."
              />
              <TouchableOpacity onPress={() => addTask("A")}>
                <FontAwesome name="plus-circle" size={22} color={Colors.accentPink} />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- Krzysztof --- */}
          <View style={styles.column as ViewStyle}>
            <Text style={styles.columnTitle}>Zadania dla Krzysia</Text>
            {krzysztofTasks.map((task) => (
              <Checkbox
                key={task.id}
                isCompleted={false}
                label={task.label}
                onRemove={() => removeTask("K", task.id)}
              />
            ))}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={newTaskK}
                onChangeText={setNewTaskK}
                placeholder="Nowe zadanie..."
              />
              <TouchableOpacity onPress={() => addTask("K")}>
                <FontAwesome name="plus-circle" size={22} color={Colors.accentPink} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// --- STYLES (pozostają bez zmian) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: Spacing.xxl * 1.5,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxl,
    alignItems: "center",
  },
    icon: {          // ← dodajemy styl dla ikonki serca
    width: 80,
    height: 80,
    marginBottom: Spacing.medium,
  },

  cardBox: {
    width: "100%",
    backgroundColor: Colors.cardBackground,
    padding: Spacing.large,
    borderRadius: Border.radius,
    alignItems: "center",
    marginBottom: Spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginBottom: Spacing.medium,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: Colors.accentPink,
  },
  profileImage: {
    width: 120,
    height: 120,
  },
  cardText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  tasksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    width: "48%",
  },
  columnTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.small,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    color: Colors.textPrimary,
    fontSize: FontSizes.small,
  },
});

const checkboxStyles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.medium,
  },
  iconContainer: {
    marginRight: Spacing.small,
  },
  taskLabel: {
    fontSize: FontSizes.small,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
});
