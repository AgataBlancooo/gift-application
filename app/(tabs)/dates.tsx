import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { db, authenticate } from '../config/firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- FUNKCJA OBLICZAJĄCA CZAS POZOSTAŁY ---
const calculateTimeRemaining = (targetDateString: string): string => {
  const targetDate = new Date(targetDateString);
  const now = new Date();

  if (targetDate.getTime() < now.getTime()) return '0 dni 0 godzin 0 minut';

  let diff = targetDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(diff / (1000 * 60));

  return `${days} dni ${hours} godzin ${minutes} minut`;
};

// --- INTERFEJS ---
interface DateItem {
  id: string;
  title: string;
  createdAt?: any;
  dateLabel?: string;
  targetDate?: string;
  daysRemaining?: number;
  isFeatured?: boolean;
}

// --- KOMPONENT WYRÓŻNIONEJ DATY ---
const FeaturedDateCard = ({
  item,
  countdownString,
  startEditing,
  deleteDate
}: {
  item: DateItem;
  countdownString: string;
  startEditing: (id: string, currentValue: string) => void;
  deleteDate: (id: string) => void;
}) => (
  <View style={styles.featuredCard}>
    <Text style={styles.featuredSubtitle}>Nadchodzące wydarzenie</Text>
    <Text style={styles.featuredTitle}>{item.title}</Text>
    {item.dateLabel && <Text style={styles.featuredDateLabel}>({item.dateLabel})</Text>}
    {item.targetDate && (
      <>
        <Text style={styles.featuredRemainingLabel}>Pozostało:</Text>
        <Text style={styles.featuredRemainingValue}>{countdownString}</Text>
      </>
    )}
    <View style={styles.featuredActions}>
      <TouchableOpacity onPress={() => startEditing(item.id, item.title)}>
        <View style={styles.featuredActionBtn}>
          <Feather name="edit-3" size={18} color={Colors.iconColorInactive} style={{ marginRight: 5 }} />
          <Text style={styles.featuredActionText}>Edytuj</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteDate(item.id)}>
        <View style={styles.featuredActionBtn}>
          <Feather name="trash-2" size={18} color={Colors.iconColorInactive} style={{ marginRight: 5 }} />
          <Text style={styles.featuredActionText}>Usuń</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

// --- GŁÓWNY EKRAN ---
export default function DatesScreen() {
  const [dates, setDates] = useState<DateItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [countdown, setCountdown] = useState<string>('');

  // --- useEffect: pobieranie danych z Firebase ---
  useEffect(() => {
    const init = async () => {
      await authenticate();
      const q = query(collection(db, 'dates'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, snapshot => {
        const items: DateItem[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data as Omit<DateItem, 'id'>,
            isFeatured: data.isFeatured // tylko z Firebase
          };
        });
        console.log('Dane z Firebase:', items);
        setDates(items);
      });
      return unsubscribe;
    };
    const unsubPromise = init();
    return () => {
      unsubPromise.then(unsub => unsub && unsub());
    };
  }, []);

  // --- useEffect: odliczanie do najbliższej daty ---
  useEffect(() => {
    if (!dates.length) return;

    const nearest = dates
      .filter(d => d.targetDate)
      .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime())[0];

    if (!nearest) return;

    setCountdown(calculateTimeRemaining(nearest.targetDate!));

    const intervalId = setInterval(() => {
      setCountdown(calculateTimeRemaining(nearest.targetDate!));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dates]);

  // --- Funkcje CRUD ---
  const addDate = async (title: string, date: Date) => {
    if (!title.trim()) return;

    const day = date.getDate();
    const month = date.toLocaleString('pl-PL', { month: 'long' });
    const dateLabel = `${day} ${month}`;
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();

    await addDoc(collection(db, 'dates'), {
      title: title.trim(),
      createdAt: serverTimestamp(),
      dateLabel,
      targetDate,
      isFeatured: false
    });
  };

  const handleSaveNewDate = async () => {
    await addDate(newTitle, newDate);
    setNewTitle('');
    setNewDate(new Date());
    setShowAddModal(false);
  };

  const deleteDate = async (id: string) => {
    Alert.alert('Usuń datę', 'Na pewno chcesz usunąć tę datę?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'dates', id));
        }
      }
    ]);
  };

  const startEditing = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditingValue(currentValue);
  };

  const saveEdit = async () => {
    if (!editingId || !editingValue.trim()) return;
    await updateDoc(doc(db, 'dates', editingId), { title: editingValue.trim() });
    setEditingId(null);
    setEditingValue('');
  };

  // --- Renderowanie pojedynczej karty ---
  const renderItem = ({ item }: { item: DateItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemContentLeft}>
        <View style={[styles.iconContainer, item.title.toLowerCase().includes('randki') ? styles.heartIconBg : styles.giftIconBg]}>
          <Feather name={item.title.toLowerCase().includes('randki') ? 'heart' : 'gift'} size={20} color={Colors.accentPink} />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.textTitle}>{item.title}</Text>
          {item.dateLabel && item.daysRemaining !== undefined && (
            <Text style={styles.textSubtitle}>
              {item.dateLabel} ({item.daysRemaining} DNI)
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actionsRight}>
        <TouchableOpacity onPress={() => startEditing(item.id, item.title)} style={styles.actionBtn}>
          <Feather name="edit-3" size={18} color={Colors.iconColorInactive} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteDate(item.id)} style={styles.actionBtn}>
          <Feather name="trash-2" size={18} color={Colors.iconColorInactive} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const nearestDate = dates
    .filter(d => d.targetDate)
    .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime())[0];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nasze Daty</Text>

      {nearestDate && (
        <FeaturedDateCard
          item={nearestDate}
          countdownString={countdown}
          startEditing={startEditing}
          deleteDate={deleteDate}
        />
      )}

      <FlatList
        data={dates.filter(d => d.id !== nearestDate?.id)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.btnAddLarge} onPress={() => setShowAddModal(true)}>
          <Feather name="plus" size={24} color={Colors.accentPink} />
          <Text style={styles.btnAddText}>DODAJ DATĘ</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL DODAWANIA DATY --- */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
          <View style={{ width:300, backgroundColor:'white', padding:20, borderRadius:10 }}>
            <Text style={{ fontWeight:'bold', marginBottom:10 }}>Nowe wydarzenie</Text>
            <TextInput
              placeholder="Tytuł"
              value={newTitle}
              onChangeText={setNewTitle}
              style={{ borderWidth:1, borderColor:'#ccc', padding:8, marginBottom:10, borderRadius:5 }}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginBottom:10 }}>
              <Text>Wybierz datę: {newDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setNewDate(selectedDate);
                }}
              />
            )}
            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={{ color:'red' }}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNewDate}>
                <Text style={{ color:'green', fontWeight:'bold' }}>Dodaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight, paddingHorizontal: 20, paddingTop: 50 },
  flatListContent: { paddingBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: Colors.textPrimary, marginBottom: 25 },
  featuredCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadowPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5
  },
  featuredSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  featuredTitle: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginVertical: 5, color: Colors.textPrimary },
  featuredDateLabel: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  featuredRemainingLabel: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' },
  featuredRemainingValue: { fontSize: 22, fontWeight: 'bold', color: Colors.accentPink, textAlign: 'center', marginBottom: 20 },
  featuredActions: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: Colors.borderColor, paddingTop: 15 },
  featuredActionBtn: { flexDirection: 'row', alignItems: 'center' },
  featuredActionText: { color: Colors.iconColorInactive, fontSize: 16 },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: Colors.shadowPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor
  },
  itemContentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  heartIconBg: { backgroundColor: Colors.lightPinkBackground },
  giftIconBg: { backgroundColor: Colors.lightPinkBackground },
  itemTextContainer: {},
  textTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  textSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  actionsRight: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8, marginLeft: 5 },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 40, paddingTop: 10, alignItems: 'center', backgroundColor: Colors.backgroundLight },
  btnAddLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.accentPink,
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 12,
    shadowColor: Colors.accentPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  btnAddText: { color: Colors.accentPink, fontWeight: 'bold', marginLeft: 8, fontSize: 15 }
});
