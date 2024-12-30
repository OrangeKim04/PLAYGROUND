import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';


export default function VideoScreen() {
  const navigation = useNavigation();
  // Video IDs
  const videoIds = [
    'uTzcK7XoF8c', // First video
    'rd2Tx5-BhBs', // Second video
    'pzbQ3bF5-zQ', // Third video
    'QIz6pl-m00Q', // Fourth video
    'etlOSulXA_8',  // Fifth video
    'oBf7KbB0CBQ'   // Sixth video
  ];
  const title = [
    '국민이&안전이와 함께 안전하게 놀이기구 타는 방법 배워볼까요?',
    '실내 놀이터에서 안전하게 놀아요!',
    '🧒우리 아이들의 놀이터! 🎠안전 수칙 꼭! 지켜주세요 [원테이크 119초 안전교육] -놀이터안전수칙편-',
    '[단독출시] 아기상어와 운동해요 | 10분이면 끝! 어린이 체조 | 아기상어 노래와 함께 | 핑크퐁! 아기상어 올리',
    '나처럼 해봐요-이렇게! 🎶 | 서울아이 뛰움 체조 따라 하기! 🏃‍♀️ (f. 크롱, 뽀로로)',
    '놀이터 안전 시리즈│로보카폴리 생활안전 베스트🚑│놀이터에서 안전하게 놀려면?│생활안전 시리즈│어린이 만화│로보카폴리 TV'
  ]

  const images = [
    require('../assets/유튜브/1.jpg'),
    require('../assets/유튜브/2.jpg'),
    require('../assets/유튜브/3.jpg'),
    require('../assets/유튜브/4.jpg'),
    require('../assets/유튜브/5.jpg'),
    require('../assets/유튜브/6.jpg'),

  ];


  // Thumbnail URLs
  const thumbnailUrls = videoIds.map(videoId => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {videoIds.map((videoId, index) => (
        <View key={index} style={styles.box}>
          <Image source={{ uri: thumbnailUrls[index] }} style={styles.thumbnail} />
          <TouchableOpacity 
            style={styles.link} 
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)}
          >
            <Image style={styles.icon} source={require('../assets/play-button.png')} />
          </TouchableOpacity>
          <Image source={images[index]} style={styles.img}/>
          <View style={{width: 340}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{title[index]}</Text>
          </View>
          <View style={{width: 350, height: 1, backgroundColor: '#fdc500', marginTop: 30}}/>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  box: {
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40, // Adds space below each video box
  }, 
  thumbnail: {
    width: 350,
    height: 190, // Aspect ratio of YouTube thumbnails (16:9)
    marginBottom: 10,
    borderRadius: 10,
  },
  link: {
    width: 200,
    height: 140,
    position: 'absolute', // Use absolute positioning
    top: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  icon: {
    width: 55,
    height: 35,
    borderRadius: 10,
  },
  img: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 3,
    left: 3,
    borderRadius: 10,
  },
});
