import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ReviewPage() {
    const route = useRoute();
    const { marker } = route.params; // marker 데이터 접근
    const [review, setReview] = useState('');
    const [submittedReviews, setSubmittedReviews] = useState([]); // 제출된 리뷰 목록

    const handleSubmit = () => {
        if (review.trim()) { // 빈 리뷰 제출 방지
            const today = new Date();
            const timestamp = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
            setSubmittedReviews([...submittedReviews, { text: review, date: timestamp }]); // 제출된 리뷰 추가
            setReview(''); // 입력 필드 초기화
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 60} // 키보드가 올라갈 때 입력창을 적절히 위치시킴
        >
            <Text style={styles.title}>{marker.pfctNm}</Text>
            <Text style={[styles.title, {fontSize: 18, position: 'absolute', top: 145, left: 170}]}>후기</Text>
            
            <ScrollView style={styles.reviewContainer}>
                {submittedReviews.map((item, index) => (
                    <View key={index} style={styles.reviewTextContainer}>
                        <Text style={styles.reviewText}>{item.text}</Text>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <View style={{height: 1, width: '100%', backgroundColor: '#FDC500', alignSelf: 'center', marginTop: 5, marginBottom: 10}}/>
                    </View>
                ))}
            </ScrollView>
            
            {/* 입력창을 ScrollView 밖으로 이동하여 키보드와 함께 올라가게 함 */}
            <View style={styles.foam}>
                <TextInput
                    style={styles.input}
                    multiline
                    placeholder="여기에 리뷰를 작성하세요..."
                    value={review}
                    onChangeText={setReview}
                    maxLength={30} // 글자 수 제한을 30자로 설정
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>제출</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        paddingTop: 70,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    foam: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10, // 추가된 여백
    }, 
    input: {
        width: 290,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 5,
    },
    button: {
        backgroundColor: '#FC9A00',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 60,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    reviewContainer: {
        marginTop: 60,
        flexDirection: 'column',
    },
    reviewText: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
    },
    reviewTextContainer: {
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'right', // 날짜를 오른쪽 정렬
    },
});
