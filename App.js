import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import PDFViewerScreen from './src/screens/PDFViewerScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'PDF Reader',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="PDFViewer" 
          component={PDFViewerScreen}
          options={{
            title: 'PDF Viewer',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="Statistics" 
          component={StatisticsScreen}
          options={{
            title: 'Usage Statistics',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
