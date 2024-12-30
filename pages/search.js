import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'react-native';

export default function SearchScreen({ navigation, route }) {
  const { markers } = route.params; // Main에서 전달된 markers 배열
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  // 검색어에 따라 markers를 필터링하는 함수
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
        const normalizedQuery = query.trim().toLowerCase();
        const queryWords = normalizedQuery.split(' '); // 검색어를 단어로 나눔

        const results = markers.filter((marker) => {
            const markerName = marker.pfctNm?.toLowerCase();
            const instlPlaceCdNm = marker.instlPlaceCdNm?.toLowerCase();
            return queryWords.every(word => 
                (markerName && markerName.includes(word)) || 
                (instlPlaceCdNm && instlPlaceCdNm.includes(word))
            );
        });

        setFilteredResults(results);
    } else {
        setFilteredResults([]);
    }
};



 // 특정 놀이터 선택 시 Main 페이지로 이동하고 선택한 마커를 전달
  const handleSelectMarker = (marker) => {
    navigation.navigate('Main', { selectedMarker: marker }); // 선택된 마커 전달
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="놀이터 이름 또는 장소 검색"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredResults}
        keyExtractor={(item, index) => `${item.pfctSn}-${index}`} // 고유 키 설정
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelectMarker(item)}
          >
            <Text style={styles.resultText}>{item.pfctNm}</Text>
            <Text style={styles.resultSubText}>{item.instlPlaceCdNm}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
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
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultSubText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
