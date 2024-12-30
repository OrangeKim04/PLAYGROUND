import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from './pages/main';
import InfoBox from './pages/InfoBox';
import Favorite from './pages/favorite';
import SearchScreen from './pages/search';
import VideoScreen from './pages/video';
import { FavoritesProvider } from './tools/provider';
import { Image } from 'react-native';
import ReviewPage from './pages/review';
import WeatherPage from './pages/weather';
import MenuPage from './pages/menu';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ChatScreen from './pages/chat';
import Personal from './pages/personal';
import Private from './pages/private';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// MainStack for main screen with InfoBox screen
function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{ title: '메인', headerShown: false }} />
      <Stack.Screen name="InfoBox" component={InfoBox} options={{ title: '정보', headerShown: false }} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: '검색', headerShown: false }} />
      <Stack.Screen name="ReviewPage" component={ReviewPage} options={{ title: '리뷰', headerShown: false }} />
      <Stack.Screen name="WeatherPage" component={WeatherPage} options={{ title: '날씨', headerShown: false }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: '챗봇', headerShown: false }} />
    </Stack.Navigator>
  );
}

// MenuStack for menu screen with nested screens
function MenuStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MenuPage" component={MenuPage} options={{ title: '메뉴' }} />
      <Stack.Screen name="Favorite" component={Favorite} options={{ title: '즐겨찾기' }} />
      <Stack.Screen 
        name="VideoScreen" 
        component={VideoScreen} 
        options={{
          title: '안전교육' }} 
      />
      <Stack.Screen name="Personal" component={Personal} options={{ title: '서비스 이용약관' }} />
      <Stack.Screen name="Private" component={Private} options={{ title: '개인정보 처리방침' }} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator with Main and Menu Tabs
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === 'Map') {
            iconSource = require('./assets/map-icon.png');
          } else if (route.name === 'Menu') {
            iconSource = require('./assets/menu.png');
          }
          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24, tintColor: focused ? '#fdc500' : 'gray' }}
            />
          );
        },
        tabBarActiveTintColor: '#fdc500',  // 활성화된 탭의 텍스트 색상
        tabBarInactiveTintColor: 'gray',   // 비활성화된 탭의 텍스트 색상
        headerShown: false,
        tabBarStyle: { zIndex: 0 }, // zIndex 낮추기
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={MainStack} 
        options={{ title: '지도' }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuStack} 
        options={{ title: '메뉴' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <FavoritesProvider>
        <AppTabs />
      </FavoritesProvider>
    </NavigationContainer>
  );
}
