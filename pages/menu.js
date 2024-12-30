import React from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function MenuPage({ navigation }) { // Include navigation prop
    return (
        <View style={styles.container}>
            <View style={styles.menuBox}>
                <TouchableOpacity style={[styles.menu, {borderTopWidth: 1}]} onPress={() => navigation.navigate('Favorite')}>
                    <Text style={styles.text}>즐겨찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('VideoScreen')}>
                    <Text style={styles.text}>안전교육 동영상</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Personal')}>
                    <Text style={styles.text}>서비스 이용약관</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu} onPress={() => navigation.navigate('Private')}>
                    <Text style={styles.text}>개인정보 처리방침</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        //justifyContent: 'center',
        alignItems: 'center',
    },
    menuBox: {
  
    },
    menu: {
        borderBottomWidth: 1,
        borderColor: '#fdc500',
        width: 390,
        height: 58,
        justifyContent: 'center',
        paddingLeft: 30,
    },
    text: {
        fontSize: 16,
    },
    
});
