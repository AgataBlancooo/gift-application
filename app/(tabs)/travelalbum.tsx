// app/(tabs)/album.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  type ViewStyle,
  type ImageSourcePropType,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';


import { db, storage, authenticate } from '../config/firebaseConfig';
import { collection, addDoc, onSnapshot, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import { Colors } from '../constants/colors';
import { FontSizes, FontWeights, FontFamilies } from "../constants/fonts";
import { Spacing, Border } from '../constants/layout';

// --- USTAWIENIA SIATKI ---
const { width } = Dimensions.get('window');
const ITEM_MARGIN = Spacing.small;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - Spacing.large * 2 - ITEM_MARGIN * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function AlbumScreen() {
  const [photos, setPhotos] = useState<{ id: string; url: string }[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ImageSourcePropType | null>(null);

  useEffect(() => {
    // Autoryzacja anonimowa
    authenticate();

    // Subskrypcja Firestore
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as {url: string}) }));
      setPhotos(items);
    });
    return unsubscribe;
  }, []);

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageRef = ref(storage, `album/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);

      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'photos'), { url, createdAt: serverTimestamp() });
    }
  };

  const deletePhoto = async (photoId: string, url: string) => {
    try {
      await deleteDoc(doc(db, 'photos', photoId));

      const storageRef = ref(storage, url.split('/o/')[1].split('?')[0]); // wyciągnięcie ścieżki w Storage
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Błąd usuwania zdjęcia:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundGradientStart, Colors.backgroundGradientEnd]}
      style={styles.container as ViewStyle}
    >
      <ScrollView contentContainerStyle={styles.scrollContent as ViewStyle}>

        {/* NAGŁÓWEK */}
        <View style={styles.headerContainer}>
          <Image source={require("../assets/images/serca.png")} style={styles.icon} />
          <Text style={styles.title}>Nasz Album</Text>
        </View>

        {/* SIATKA ZDJĘĆ */}
        <View style={styles.photoGrid as ViewStyle}>
          {photos.map((photo, index) => {
            const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
            return (
              <TouchableOpacity
                key={photo.id}
                style={[styles.photoContainer, { marginRight: isLastInRow ? 0 : ITEM_MARGIN }]}
                onPress={() => setSelectedPhoto({ uri: photo.url })}
                onLongPress={() => deletePhoto(photo.id, photo.url)} // długie przytrzymanie usuwa
              >
                <Image source={{ uri: photo.url }} style={styles.photo} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PRZYCISK DODAJ ZDJĘCIE */}
        <TouchableOpacity style={styles.addButton} onPress={pickAndUploadImage}>
          <FontAwesome name="plus" size={FontSizes.large} color={Colors.textPrimary} />
          <Text style={styles.addButtonText}>DODAJ ZDJĘCIE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PEŁNOEKRANOWEGO ZDJĘCIA */}
      <Modal visible={!!selectedPhoto} transparent={true}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => setSelectedPhoto(null)}>
            <View style={styles.modalContainer}>
              {selectedPhoto && (
                <Image source={selectedPhoto} style={styles.fullscreenImage} resizeMode="contain" />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingTop: Spacing.xxl * 1.5,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 8,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.h1,
    color: Colors.textPrimary,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: width - Spacing.large * 2,
    marginBottom: Spacing.xxl,
  },
  photoContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: Border.radiusSmall,
    overflow: 'hidden',
    marginBottom: ITEM_MARGIN,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.medium,
    borderRadius: Border.radius,
    backgroundColor: Colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginLeft: Spacing.small,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
