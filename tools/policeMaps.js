// PoliceMap.js
import React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text, Image, View } from 'react-native';

const PoliceMap = ({ protectMarkers, handleMarkerPress }) => {
  return (
    <MapView style={{ flex: 1 }}>
      {protectMarkers.map((protect, index) => (
        <Marker
          key={`protect-${index}`}
          coordinate={{
            latitude: protect.latitude,
            longitude: protect.longitude,
          }}
          pinColor='yellow'
          onPress={() => handleMarkerPress(protect)}
        >
          <Callout>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Image
                source={require('../assets/protect-icon.png')} // 아이콘 이미지 경로
                style={{ width: 30, height: 30 }} // 원하는 크기로 조정
              />
              <Text>{`${protect.name}`}</Text> 
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

export default PoliceMap;