import React from 'react';
import { TouchableOpacity, View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavorites } from '../tools/provider';
import { useNavigation } from '@react-navigation/native';

export default function Favorite() {
  const {favorites} = useFavorites();
  const navigation = useNavigation();


  const handleFavoritePress = (marker) => {
    /* console.log(marker)  marker는 잘 전달됨*/
    navigation.navigate('Main', { selectedMarker: marker });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>즐겨찾기 목록</Text> */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.pfctSn}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleFavoritePress(item)}>
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteTitle}>{item.pfctNm}</Text>
              <Text>{item.instlPlaceCdNm}</Text>
              <Text>주소: {item.ronaAddr}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'white',
    },
    title: {
      marginLeft: 10,
      fontSize: 25,
      marginTop: 10,
      marginBottom: 40,
      fontWeight: 'bold',
      
    },
  favoriteItem: {
    padding: 10,
    borderBottomColor: '#fdc500',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
