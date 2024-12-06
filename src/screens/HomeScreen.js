import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const HomeScreen = ({ navigation }) => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    loadSavedPDFs();
    updateAppUsageTime();
  }, []);

  const loadSavedPDFs = async () => {
    try {
      const savedPDFs = await AsyncStorage.getItem('savedPDFs');
      if (savedPDFs) {
        setPdfs(JSON.parse(savedPDFs));
      }
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  };

  const updateAppUsageTime = async () => {
    const now = new Date('2024-12-07T08:10:31+09:00').getTime();
    try {
      const lastUsage = await AsyncStorage.getItem('lastUsageTime');
      await AsyncStorage.setItem('lastUsageTime', now.toString());
      
      if (lastUsage) {
        const totalUsage = await AsyncStorage.getItem('totalUsageTime') || '0';
        const newTotal = parseInt(totalUsage) + (now - parseInt(lastUsage));
        await AsyncStorage.setItem('totalUsageTime', newTotal.toString());
      }
    } catch (error) {
      console.error('Error updating usage time:', error);
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled) {
        const { uri, name } = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(uri);
        
        // Save PDF info
        const newPDF = {
          id: Date.now().toString(),
          name,
          uri,
          timeSpent: 0,
          lastOpened: new Date('2024-12-07T08:10:31+09:00').getTime(),
        };

        const updatedPDFs = [...pdfs, newPDF];
        setPdfs(updatedPDFs);
        await AsyncStorage.setItem('savedPDFs', JSON.stringify(updatedPDFs));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick PDF');
    }
  };

  const openPDF = (pdf) => {
    navigation.navigate('PDFViewer', { pdf });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PDF Reader</Text>
      <TouchableOpacity style={styles.button} onPress={pickPDF}>
        <Text style={styles.buttonText}>Select PDF</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.statsButton}
        onPress={() => navigation.navigate('Statistics')}>
        <Text style={styles.buttonText}>View Statistics</Text>
      </TouchableOpacity>

      <FlatList
        data={pdfs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pdfItem}
            onPress={() => openPDF(item)}>
            <Text style={styles.pdfName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statsButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pdfItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pdfName: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
