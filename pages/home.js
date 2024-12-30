import { StyleSheet, View, Image, Text} from 'react-native';
import { useFonts } from 'expo-font';
export default function Main() {
    const [fontsLoaded] = useFonts({
        cookie: require("../assets/Fonts/CookieRun Bold.ttf"),
        
      });
    return (

        <View style={styles.container}>
            <Image source={require('../assets/playground.png')} style={styles.icon} />
            <Text style={styles.text}>놀이터백과</Text>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fdc500', // 원하는 배경색으로 변경
      },
      icon: {
        width: 200, // 아이콘 크기 예시
        height: 200, // 아이콘 크기 예시
      },
      text: {
        fontFamily: 'cookie',
        fontSize: 70,
        color: 'white',
        marginBottom: 80,
      }
  });