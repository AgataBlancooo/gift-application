import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { db, authenticate } from '../config/firebaseConfig.js'; 
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

// Typ pojedynczej daty
interface DateItem {
  id: string;
  title: string;
  createdAt?: any;
}

export default function DatesScreen() {
  // ⬇️ tu był problem — brak typu, dodałam <DateItem[]>
  const [dates, setDates] = useState<DateItem[]>([]);
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    const init = async () => {
      await authenticate();

      const q = query(collection(db, 'dates'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, snapshot => {
        const items: DateItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<DateItem, 'id'>)
        }));
        setDates(items);
      });

      return unsubscribe;
    };

    const unsubPromise = init();
    return () => {
      unsubPromise.then(unsub => unsub && unsub());
    };
  }, []);

  const addDate = async () => {
    if (!newDate.trim()) return;
    await addDoc(collection(db, 'dates'), {
      title: newDate.trim(),
      createdAt: serverTimestamp(),
    });
    setNewDate('');
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

  const renderItem = ({ item }: { item: DateItem }) => (
    <View style={styles.item}>
      {editingId === item.id ? (
        <>
          <TextInput
            style={styles.inputEdit}
            value={editingValue}
            onChangeText={setEditingValue}
          />
          <TouchableOpacity onPress={saveEdit} style={styles.btnSave}>
            <Text style={styles.btnText}>Zapisz</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>{item.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => startEditing(item.id, item.title)}>
              <Text style={styles.edit}>Edytuj</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteDate(item.id)}>
              <Text style={styles.delete}>Usuń</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ważne daty</Text>

      <FlatList
        data={dates}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dodaj nową datę"
          value={newDate}
          onChangeText={setNewDate}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={addDate}>
          <Text style={styles.btnText}>Dodaj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#f8f8f8', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  text: { fontSize: 16, flex: 1 },
  actions: { flexDirection: 'row' },
  edit: { color: '#007bff', marginRight: 16 },
  delete: { color: 'red' },
  addContainer: { flexDirection: 'row', marginTop: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8
  },
  inputEdit: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 10
  },
  btnAdd: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  btnSave: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  btnText: { color: '#fff', fontWeight: '600' }
});
