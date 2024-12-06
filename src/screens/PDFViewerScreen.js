import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PDFViewerScreen = ({ route, navigation }) => {
  const { pdf } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
    const startTime = new Date('2024-12-07T08:10:31+09:00').getTime();

    return () => {
      updatePDFUsageTime(startTime);
    };
  }, []);

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem(`bookmarks-${pdf.id}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const updatePDFUsageTime = async (startTime) => {
    try {
      const endTime = new Date('2024-12-07T08:10:31+09:00').getTime();
      const timeSpent = endTime - startTime;

      const savedPDFs = JSON.parse(await AsyncStorage.getItem('savedPDFs')) || [];
      const updatedPDFs = savedPDFs.map(p => {
        if (p.id === pdf.id) {
          return {
            ...p,
            timeSpent: (p.timeSpent || 0) + timeSpent,
            lastOpened: endTime,
          };
        }
        return p;
      });

      await AsyncStorage.setItem('savedPDFs', JSON.stringify(updatedPDFs));
    } catch (error) {
      console.error('Error updating PDF usage time:', error);
    }
  };

  const addBookmark = async () => {
    try {
      const newBookmark = { page: currentPage, timestamp: new Date('2024-12-07T08:10:31+09:00').getTime() };
      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);
      await AsyncStorage.setItem(`bookmarks-${pdf.id}`, JSON.stringify(updatedBookmarks));
      Alert.alert('Success', `Bookmark added for page ${currentPage}`);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const onLoadComplete = (numberOfPages) => {
    setTotalPages(numberOfPages);
    if (numberOfPages < 603) {
      Alert.alert(
        'Warning',
        'This PDF has fewer than 603 pages. Some content might be missing.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.pageInput}
          keyboardType="numeric"
          value={currentPage.toString()}
          onChangeText={(text) => {
            const page = parseInt(text);
            if (page && page > 0 && page <= totalPages) {
              setCurrentPage(page);
            }
          }}
        />
        <Text style={styles.pageCount}>/ {totalPages}</Text>
        <TouchableOpacity style={styles.bookmarkButton} onPress={addBookmark}>
          <Text style={styles.buttonText}>Bookmark</Text>
        </TouchableOpacity>
      </View>

      <Pdf
        source={{ uri: pdf.uri }}
        style={styles.pdf}
        page={currentPage}
        onPageChanged={(page) => setCurrentPage(page)}
        onLoadComplete={onLoadComplete}
        enablePaging={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  pageInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
    textAlign: 'center',
  },
  pageCount: {
    marginRight: 15,
  },
  bookmarkButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default PDFViewerScreen;
