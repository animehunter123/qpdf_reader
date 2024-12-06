import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatisticsScreen = () => {
  const [appUsage, setAppUsage] = useState(0);
  const [pdfStats, setPdfStats] = useState([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // Get total app usage time
      const totalUsageTime = await AsyncStorage.getItem('totalUsageTime');
      setAppUsage(parseInt(totalUsageTime || '0'));

      // Get PDF statistics
      const savedPDFs = JSON.parse(await AsyncStorage.getItem('savedPDFs')) || [];
      setPdfStats(savedPDFs);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>App Usage Statistics</Text>
        <Text style={styles.stat}>Total Time: {formatTime(appUsage)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>PDF Statistics</Text>
        {pdfStats.map((pdf) => (
          <View key={pdf.id} style={styles.pdfStat}>
            <Text style={styles.pdfName}>{pdf.name}</Text>
            <Text style={styles.statDetail}>Time Spent: {formatTime(pdf.timeSpent || 0)}</Text>
            <Text style={styles.statDetail}>Last Opened: {formatDate(pdf.lastOpened)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  stat: {
    fontSize: 16,
    color: '#666',
  },
  pdfStat: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  pdfName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  statDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
});

export default StatisticsScreen;
