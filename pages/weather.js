import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
export default function WeatherPage(){
    
    const route = useRoute();
    const {weatherData} = route.params;
    function getWindDirection(degree) {
        if (degree >= 0 && degree < 22.5) return '북';
        else if (degree >= 22.5 && degree < 67.5) return '북동';
        else if (degree >= 67.5 && degree < 112.5) return '동';
        else if (degree >= 112.5 && degree < 157.5) return '남동';
        else if (degree >= 157.5 && degree < 202.5) return '남';
        else if (degree >= 202.5 && degree < 247.5) return '남서';
        else if (degree >= 247.5 && degree < 292.5) return '서';
        else if (degree >= 292.5 && degree < 337.5) return '북서';
        else return '북'; // 337.5도 이상은 북쪽으로 처리
    }
    const getDust = (level) => {
        if (level <= 15) {
          return '좋음'; // 0~15: 파란색
        } else if (level <= 35) {
          return '보통'; // 16~35: 초록색
        } else if (level <= 75) {
          return '나쁨'; // 36~75: 주황색
        } else {
          return '매우나쁨'; // 76 이상: 빨간색
        }
      };
      const getOzon = (level) => {
        if (level <= 0.03) {
          return '좋음'; // 0~15: 파란색
        } else if (level <= 0.09) {
          return '보통'; // 16~35: 초록색
        } else if (level <= 0.15) {
          return '나쁨'; // 36~75: 주황색
        } else {
          return '매우나쁨'; // 76 이상: 빨간색
        }
      };
    const windDegree = weatherData.windDeg; // 바람의 방향 각도
    const windDirection = getWindDirection(windDegree);
    return(
        <View style={styles.container}>
            <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>{weatherData.city} {weatherData.district}</Text>
            <Image source={{ uri: weatherData.weatherIconUrl }} style={{width: 200, height: 200, alignSelf: 'center'/* , position: 'absolute', top: 100 */}} />
            <Text style={{fontSize: 50, fontWeight: 'bold', position: 'absolute', top: 310, left: 150}}>{weatherData.temp}°</Text>
            <Text style={{marginTop: 38, textAlign: 'center', color: '#929292'}}>{weatherData.weatherType}</Text>
            <View style={styles.box}>
                <View style={styles.mini}>
                    
                    <Image source={require('../assets/wind.png')} style={{width: 30, height: 30}}/>
                    <View style={styles.text}>
                        <Text style={{fontWeight: 'bold', color: '#FC6F00'}}>{weatherData.windSpeed}m/s</Text>
                        <Text>바람</Text>
                        <Text style={{fontWeight: 'bold'}}>{windDirection}풍</Text>
                        
                    </View>
                </View>
                <View style={styles.mini}>
                <Image source={require('../assets/체감온도.png')} style={{width: 30, height: 30}}/>
                    <View style={styles.text}>
                    <Text style={{fontWeight: 'bold', color: '#FC6F00'}}>{weatherData.feelsLike}°</Text>
                    <Text>체감온도</Text>
                    <Text></Text>
                    </View>
                </View>
                <View style={styles.mini}>
                <Image source={require('../assets/dust.png')} style={{width: 30, height: 30}}/>
                    <View style={styles.text}>
                    <Text style={{fontWeight: 'bold', color: '#FC6F00'}}>{weatherData.dust10}</Text>
                    <Text>미세먼지</Text>
                    
                    <Text style={{fontWeight: 'bold'}}>{getDust(weatherData.dust10)}</Text>
                    </View>
                </View>
                <View style={styles.mini}>
                <Image source={require('../assets/ozon.png')} style={{width: 35, height: 35}}/>
                    <View style={styles.text}>
                    <Text style={{fontWeight: 'bold', color: '#FC6F00'}}>{weatherData.ozon}</Text>
                    <Text>오존</Text>
                    
                    <Text style={{fontWeight: 'bold'}}>{getOzon(weatherData.ozon)}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.box, {height: 100, marginTop: 40, flexDirection: 'column', justifyContent: 'center'}]}>
                <Text style={{fontWeight: 'bold', fontSize: 15, paddingHorizontal: 20, color: '#FC6F00', }}>*날씨 예보 및 공공데이터 반영주기에 따라 실제 날씨와 상이할 수 있습니다.</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold', color: 'gray', marginTop: 6}}>제공: OpenWeather</Text>
            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        paddingTop: 100,
    },
    box: {
        marginTop: 40,
        width: '100%',
        height: 170,
        backgroundColor: '#EDEDED',
        alignSelf: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    mini: {
        //borderWidth: 1,
        height: 140,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    text: {
        height: 70,
        //borderWidth: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});
