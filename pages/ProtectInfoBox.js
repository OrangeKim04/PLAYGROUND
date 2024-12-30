// ProtectInfoBox.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Share } from 'react-native';

const ProtectInfoBox = ({ marker}) => {
  const shareAddress = async () => {
    try {
        await Share.share({
            message: `[놀이터백과]\n\n[안전지킴이집 정보]\n이름: ${marker.name}\n주소: ${marker.adres}`,
        });
      } catch (error) {
            console.error("Error sharing address:", error);
      }
  };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>안전지킴이집</Text>
            <Image
                source={require('../assets/protect-icon.png')}
                style={styles.image}
            />
            <View style={{ flexDirection: 'row' , marginBottom: 5}}>
                        <View style={{ marginRight: 34, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>이름</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{fontSize: 15}}>{marker.name}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' , alignItems: 'center',  marginBottom: 5}}>
                        <View style={{ marginRight: 34, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>주소</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{fontSize: 15}}>{marker.adres}</Text>
                        </View>
                    </View>
            {/* 주소 공유 버튼 */}
            <TouchableOpacity onPress={shareAddress} style={styles.Button}>
                <Image 
                    source={require('../assets/share-button.png')} // 공유 아이콘의 경로
                    style={styles.ButtonImage} // 스타일 추가
                />
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 220,
        padding: 20,
        paddingLeft: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        paddingTop: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    image: {
        width: 90,
        height: 90,
        marginVertical: 5,
        marginBottom: 10,
    },
    Button: {
        position: 'absolute',
        top: 22,
        left: 150,
        width: 30, 
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
  },
    ButtonImage: {
        width: 23,
        height: 23,
        tintColor: '#fdc500', // 원하는 색상으로 변경 가능
    },

});

export default ProtectInfoBox;
