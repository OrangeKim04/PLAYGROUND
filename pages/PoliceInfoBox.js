import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Share } from 'react-native';

const PoliceInfoBox = ({ marker }) => {
    const fullName = `${marker.name1} ${marker.name2} ${marker.name3}`; // 경찰서 이름 결합

    const shareAddress = async () => {
        try {
            await Share.share({
                message: `[놀이터백과]\n\n[경찰서 정보]\n이름: ${fullName}\n전화번호: ${marker.num}\n주소: ${marker.주소}`,
            });
        } catch (error) {
            console.error("Error sharing address:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>경찰서</Text>
            <View style={{ flexDirection: 'row' , marginBottom: 5}}>
                        <View style={{ marginRight: 60, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>이름</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{fontSize: 15}}>{fullName}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' , alignItems: 'center',  marginBottom: 5}}>
                        <View style={{ marginRight: 34, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>전화번호</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{fontSize: 15}}>{marker.num}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' , alignItems: 'center', marginBottom: 5}}>
                        <View style={{ marginRight: 58, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>주소</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{fontSize: 15}}>{marker.주소}</Text>
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
        height: 160,
        padding: 20,
        paddingTop: 30,
        paddingLeft: 30,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    Button: {
        position: 'absolute',
        top: 22,
        left: 100,
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

export default PoliceInfoBox;
