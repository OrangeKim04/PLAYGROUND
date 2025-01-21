import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, Circle, Callout } from "react-native-maps";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import Home from "./home";
import InfoBox from "./InfoBox";
import PoliceInfoBox from "./PoliceInfoBox";
import ProtectInfoBox from "./ProtectInfoBox";
import { useRoute } from "@react-navigation/native";
import { useFavorites } from "../tools/provider";
import playgroundData from "../datas/마포구_놀이터_정보_업데이트.json";
import ProtectData from "../datas/마포구_안전지킴이집.json";
import ChildSafeZoneData from "../datas/마포구_어린이보호구역.json";
import PoliceData from "../datas/마포구_경찰서.json";
import safetyInspectionData from "../datas/마포구_안전검사.json";
import insuranceData from "../datas/마포구_보험가입.json";
import goodData from "../datas/우수시설.json";
import { API_KEY1, API_KEY2 } from "@env";
//import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get("window");

export default function Main({ navigation }) {
  const [city, setCity] = useState("Loading...");
  const [street, setStreet] = useState("Loading...");
  const [weatherData, setWeatherData] = useState([]);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [goodMarkers, setGoodMarkers] = useState([]);
  const [protectMarkers, setProtectMarkers] = useState([]); // 안전지킴이집
  const [childSafeZones, setChildSafeZones] = useState([]); // 어린이 보호구역
  const [policeMarkers, setPoliceMarkers] = useState([]); // 경찰서
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [InfoBoxVisible, setInfoBoxVisible] = useState(false);
  const [policeInfoBoxVisible, setPoliceInfoBoxVisible] = useState(false);
  const [protectInfoBoxVisible, setProtectInfoBoxVisible] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  const route = useRoute();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const mapRef = useRef(null);
  // 즐겨찾기 추가/삭제 함수
  const isFavorite = (marker) =>
    favorites.some((fav) => fav.pfctSn === marker.pfctSn);

  useEffect(() => {
    // Favorite 페이지에서 전달된 selectedMarker가 있는 경우 해당 위치로 이동 및 InfoBox 표시
    if (route.params?.selectedMarker) {
      const marker = route.params.selectedMarker;
      moveToMarker(marker); // 마커로 이동
      showInfoBoxForMarker(marker); // InfoBox 표시
      // 선택한 마커를 설정한 후 route.params 초기화하여 중복 실행 방지
      navigation.setParams({ selectedMarker: null });
    }
  }, [route.params?.selectedMarker]);

  // 초기 위치 권한 요청 및 마커 데이터 가져오기
  useEffect(() => {
    const initializeLocationAndMarkers = async () => {
      // setLocation(null);
      // setLoading(true);
      // setCity("Loading...");
      // setStreet("Loading...");
      await ask();
      await fetchMarkers();
      await fetchGoodMarkers();
      await fetchProtectMarkers();
      await fetchPoliceMarkers();
    };
    initializeLocationAndMarkers();
  }, []);

  useEffect(() => {
    const loadChildSafeZones = () => {
      const uniqueSafeZones = ChildSafeZoneData.reduce((acc, zone) => {
        const key = `${zone.위도}-${zone.경도}`; // 고유한 키 생성
        if (!acc.some((item) => item.key === key)) {
          acc.push({
            key, // 중복 확인용 고유 키
            latitude: zone.위도,
            longitude: zone.경도,
            radius: zone.보호구역도로폭 * 5, // 원하는 반경(m) 설정
          });
        }
        return acc;
      }, []);

      setChildSafeZones(uniqueSafeZones); // 중복 제거된 안전지대 설정
    };

    loadChildSafeZones();
  }, []);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      console.error("위치 접근 권한이 필요합니다.");
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation({ latitude, longitude });
    setLoading(false);
    fadeOut();
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    // 위치
    //console.log(location);
    setCity(location[0].city);
    setStreet(location[0].district);

    // console.log(city);
    // console.log(street);

    //날씨
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=kr&units=metric&appid=${API_KEY1}`
    );
    const json = await response.json();
    //console.log(json);

    // sidoName이 서울인데 인코딩해서 넣어야 함 -> %EC%84%9C%EC%9A%B8
    const dust = await fetch(
      `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${API_KEY2}&sidoName=%EC%84%9C%EC%9A%B8&returnType=json`
    );
    //const text = await dust.text(); // JSON 파싱 전에 텍스트로 변환
    //console.log('응답 내용:', text); // 응답 내용 로그
    const dustData = await dust.json();
    const dustFinal = dustData.response.body.items[4]; // 마포구
    /* console.log(dustFinal);
    console.log(dustFinal.pm10Value); // 미세먼지
    console.log(dustFinal.o3Value); */

    //console.log(dustData.response.body.items[4]);

    const All = {
      city: location[0].city, // 도시 시
      district: location[0].district, // 도시 주소
      weatherType: json.weather[0].description, // 날씨 상태
      temp: Math.round(json.main.temp * 10) / 10, // 현재 온도
      weatherIconUrl: `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`, // Weather icon URL
      windSpeed: json.wind.speed, // 바람속도
      windDeg: json.wind.deg, // 바람 방향
      humidity: json.main.humidity, // 습도
      feelsLike: json.main.feels_like, // 체감온도
      dust10: dustFinal.pm10Value,
      ozon: dustFinal.o3Value,
    };
    //console.log(All);
    setWeatherData(All);
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };
  const fetchMarkers = async () => {
    // JSON 파일에서 latitude와 longitude가 null이 아닌 항목만 필터링
    const validMarkers = playgroundData
      .filter((play) => play.latCrtsVl && play.lotCrtsVl) // 위도와 경도가 존재하는 항목만 필터링
      .map((play) => {
        const safetyInfo = safetyInspectionData.find(
          (safety) => safety.pfctSn === play.pfctSn // pfctSn이 같은 데이터를 찾음
        );
        const insuranceInfo = insuranceData.find(
          (insurance) => insurance.pfctSn === play.pfctSn // pfctSn이 같은 보험 정보를 찾음
        );
        const markerInfo = {
          ...play,
          latitude: play.latCrtsVl, // JSON 파일의 위도 필드
          longitude: play.lotCrtsVl, // JSON 파일의 경도 필드
          score: play.score,
          inspKndCdNm: safetyInfo ? safetyInfo.inspKndCdNm : null, // 안전 검사 종류
          vldYmd: safetyInfo ? safetyInfo.vldYmd : null, // 유효 일자
          passYn: safetyInfo ? safetyInfo.passYn : null, // 검사 통과 여부
          inspYmd: safetyInfo ? safetyInfo.inspYmd : null, // 검사 일자
          insrncMngSn: insuranceInfo ? insuranceInfo.insrncMngSn : null, // 보험 관리 번호
          joinYmd: insuranceInfo ? insuranceInfo.joinYmd : null, // 가입 일자
          mtryYmd: insuranceInfo ? insuranceInfo.mtryYmd : null, // 만료 일자
          insu: insuranceInfo ? insuranceInfo.insu : null, // 보험사
        };

        /*  // 콘솔에 출력
            console.log(`놀이터 이름: ${markerInfo.pfctNm}`);
            console.log(`안전 검사 종류: ${markerInfo.inspKndCdNm}`);
            console.log(`유효 일자: ${markerInfo.vldYmd}`);
            console.log(`검사 통과 여부: ${markerInfo.passYn}`);
            console.log(`검사 일자: ${markerInfo.inspYmd}`);
            console.log(`보험관리 번호: ${markerInfo.insrncMngSn}`);
            console.log(`가입 일자: ${markerInfo.joinYmd}`);
            console.log(`만료 일자: ${markerInfo.mtryYmd}`);
            console.log(`보험사: ${markerInfo.insu}`)
            console.log('--------------------'); // 구분선 */

        return markerInfo;
      });

    // 상태 업데이트
    setMarkers(validMarkers);
  };

  const fetchGoodMarkers = async () => {
    // JSON 파일에서 latitude와 longitude가 null이 아닌 항목만 필터링
    const validMarkers = goodData
      .filter((play) => play.latCrtsVl && play.lotCrtsVl) // 위도와 경도가 존재하는 항목만 필터링
      .map((play) => {
        const markerInfo = {
          ...play,
          latitude: play.latCrtsVl, // JSON 파일의 위도 필드
          longitude: play.lotCrtsVl, // JSON 파일의 경도 필드
        };

        // 콘솔에 출력
        console.log("-------------------------");
        console.log(markerInfo.latitude);
        console.log(markerInfo.longitude);

        return markerInfo;
      });

    // 상태 업데이트
    setGoodMarkers(validMarkers);
  };

  // 지킴이집
  const fetchProtectMarkers = async () => {
    const validProtectMarkers = ProtectData.map((protect) => {
      const latitude = protect.LO;
      const longitude = protect.LA;
      const name = protect.SR_NM;
      const adres = protect.ADRES;
      return {
        ...protect,
        latitude: Number(latitude),
        longitude: Number(longitude),
        name: name,
        adres: adres,
      };
    });

    setProtectMarkers(validProtectMarkers);
  };

  // 경찰서
  const fetchPoliceMarkers = async () => {
    const validPoliceMarkers = PoliceData.map((police) => {
      const latitude = police.Latitude;
      const longitude = police.Longitude;
      const name1 = police.경찰서;
      const name2 = police.관서명;
      const name3 = police.구분;
      const num = police.전화번호;

      return {
        ...police,
        latitude: Number(latitude),
        longitude: Number(longitude),
        name1: name1,
        name2: name2,
        name3: name3,
        num: num,
      };
    });

    setPoliceMarkers(validPoliceMarkers);
  };

  // 내 위치로 가기
  const moveToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        500
      );
    }
  };

  const moveToMarker = (marker) => {
    // 지도 위치를 선택된 마커로 이동
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: marker.latitude,
          longitude: marker.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        500
      );
    }
  };

  const showInfoBoxForMarker = (marker) => {
    setSelectedMarker(marker);
    setInfoBoxVisible(true);
    showInfoBox();
  };

  const showPoliceInfoBoxForMarker = (marker) => {
    setSelectedMarker(marker);
    setPoliceInfoBoxVisible(true);
    showPoliceInfoBox();
  };
  const showProtectInfoBoxForMarker = (marker) => {
    setSelectedMarker(marker);
    setProtectInfoBoxVisible(true);
    showProtectInfoBox();
  };
  /* const handleMarkerPress = (marker) => {
    // 지도 위치를 선택된 마커로 이동시키고 InfoBox를 표시
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: marker.latitude,
          longitude: marker.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        500
      );
    }

    setSelectedMarker(marker);
    setInfoBoxVisible(true);
    showInfoBox();
  }; */

  const closeInfoBox = (callback) => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setInfoBoxVisible(false);
      if (callback) callback();
    });
  };
  const closePoliceInfoBox = (callback) => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setPoliceInfoBoxVisible(false);
      if (callback) callback();
    });
  };
  const closeProtectInfoBox = (callback) => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setProtectInfoBoxVisible(false);
      if (callback) callback();
    });
  };

  const handleMapPress = () => {
    if (InfoBoxVisible) closeInfoBox();
    if (policeInfoBoxVisible) closePoliceInfoBox();
    if (protectInfoBoxVisible) closeProtectInfoBox();
  };

  const handleSearch = () => {
    const foundMarker = markers.find((marker) =>
      marker.pfctNm.includes(searchQuery)
    );
    if (foundMarker && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: foundMarker.latitude,
          longitude: foundMarker.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        500
      );
      setSelectedMarker(foundMarker);
      setInfoBoxVisible(true);
    } else {
      alert("검색 결과가 없습니다.");
    }
  };

  if (loading) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Home />
      </Animated.View>
    );
  }
  // InfoBox 슬라이드를 위한 함수 추가
  const showInfoBox = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // 고정된 높이 값으로 설정
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const showPoliceInfoBox = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // 고정된 높이 값으로 설정
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const showProtectInfoBox = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // 고정된 높이 값으로 설정
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getGaugeColor = (level) => {
    if (level <= 15) {
      return "blue"; // 0~15: 파란색
    } else if (level <= 35) {
      return "green"; // 16~35: 초록색
    } else if (level <= 75) {
      return "orange"; // 36~75: 주황색
    } else {
      return "red"; // 76 이상: 빨간색
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate("SearchScreen", { markers })}
      >
        <Image
          source={require("../assets/search-icon.png")}
          style={{ width: 17, height: 17, tintColor: "gray" }}
        />
        <Text style={styles.searchButtonText}>검색</Text>
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress} // 지도를 누르면 InfoBox가 닫힘
      >
        <Circle
          center={location}
          radius={5}
          strokeColor="rgba(255, 0, 0, 1)" // 빨간색 외곽선
          fillColor="rgba(255, 0, 0, 0.5)" // 빨간색 내부
        />

        <Marker
          coordinate={location}
          pinColor="red" // 점의 색상을 파란색으로 설정
        />

        {/* 놀이터 마커 */}
        {markers.map((play, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: play.latitude,
              longitude: play.longitude,
            }}
            pinColor="orange"
            onPress={() => {
              moveToMarker(play); // 마커로 이동
              showInfoBoxForMarker(play); // InfoBox 표시
            }}
          >
            <Callout>
              <Text>{play.pfctNm}</Text>
            </Callout>
          </Marker>
        ))}

        {/* 우수시설 놀이터 마커 */}
        {goodMarkers.map((play, index) => {
          // play.rmk를 ':'로 나누기
          const [firstPart, secondPart] = play.rmk.split(":");

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: play.latitude,
                longitude: play.longitude,
              }}
              pinColor="purple"
              onPress={() => {
                moveToMarker(play); // 마커로 이동
              }}
            >
              <Callout
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 12,
                  paddingTop: 6,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {play.pfctNm}
                </Text>
                <Text style={{ textAlign: "center" }}>{firstPart.trim()}</Text>
                <Text style={{ textAlign: "center" }}>
                  {secondPart?.trim()}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {Array.from({ length: 10 }, (_, index) => (
                    <Image
                      key={index} // 고유한 키를 지정해야 합니다
                      source={require("../assets/score.png")}
                      style={{ width: 12, height: 12, marginLeft: 2 }} // 이미지 사이에 여백을 추가할 수 있습니다
                    />
                  ))}
                </View>
              </Callout>
            </Marker>
          );
        })}
        {/* 안전지킴이집 마커 */}
        {protectMarkers.map((protect, index) => (
          <Marker
            key={`protect-${index}`}
            coordinate={{
              latitude: protect.latitude,
              longitude: protect.longitude,
            }}
            pinColor="yellow"
            onPress={() => {
              moveToMarker(protect);
              showProtectInfoBoxForMarker(protect);
            }}
          >
            <Callout>
              <Image
                source={require("../assets/protect-icon.png")}
                style={styles.calloutImage}
              />
            </Callout>
          </Marker>
        ))}
        {/* 경찰서 표시 */}
        {policeMarkers.map((police, index) => (
          <Marker
            key={`police-${index}`}
            coordinate={{
              latitude: police.latitude,
              longitude: police.longitude,
            }}
            pinColor="blue"
            onPress={() => {
              moveToMarker(police);
              showPoliceInfoBoxForMarker(police);
            }}
          >
            <Callout>
              <Text
                style={{ textAlign: "center" }}
              >{`${police.name1} ${police.name2} ${police.name3}`}</Text>
            </Callout>
          </Marker>
        ))}
        {/* 어린이 보호구역 원 표시 */}
        {childSafeZones.map((zone, index) => (
          <Circle
            key={`zone-${index}`}
            center={{
              latitude: zone.latitude,
              longitude: zone.longitude,
            }}
            radius={zone.radius}
            strokeColor="rgba(255, 165, 0, 0.5)" // 주황색 테두리
            fillColor="rgba(255, 165, 0, 0.2)" // 주황색 내부
          />
        ))}
      </MapView>

      {InfoBoxVisible && selectedMarker && (
        <View style={styles.infoBoxContainer}>
          <InfoBox
            marker={selectedMarker}
            slideAnim={slideAnim}
            toggleFavorite={toggleFavorite} // 즐겨찾기 토글 전달
            isFavorite={isFavorite(selectedMarker)} // 즐겨찾기 여부 전달
            style={{ zIndex: 10 }}
            navigation={navigation}
          />
        </View>
      )}
      {policeInfoBoxVisible && selectedMarker && (
        <View style={styles.infoBoxContainer}>
          <PoliceInfoBox marker={selectedMarker} style={{ zIndex: 10 }} />
        </View>
      )}
      {protectInfoBoxVisible && selectedMarker && (
        <View style={styles.infoBoxContainer}>
          <ProtectInfoBox marker={selectedMarker} style={{ zIndex: 10 }} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={moveToCurrentLocation}
          style={styles.iconButton}
        >
          <Image
            source={require("../assets/location.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {weatherData && (
        <TouchableOpacity
          onPress={() => navigation.navigate("WeatherPage", { weatherData })}
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            position: "absolute",
            bottom: 98,
            left: 15,
            width: 44,
            height: 80,
            borderRadius: 30,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <Image
            source={{ uri: weatherData.weatherIconUrl }}
            style={{ width: 50, height: 50, position: "absolute", bottom: 35 }}
          />
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              marginLeft: 3,
              marginTop: 30,
            }}
          >
            {weatherData.temp}°
          </Text>
          {/* 게이지바 */}
          <View style={styles.gaugeContainer}>
            <View
              style={[
                styles.gaugeFill,
                {
                  width: `${weatherData.dust10}%`,
                  backgroundColor: getGaugeColor(weatherData.dust10),
                },
              ]}
            />
          </View>
          <Text
            style={{
              fontSize: 9,
              color: getGaugeColor(weatherData.dust10),
              fontWeight: "bold",
            }}
          >
            미세
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ position: "absolute", bottom: 40, right: 15 }}>
        <TouchableOpacity
          style={styles.videoButton}
          onPress={() => navigation.navigate("Chat")}
        >
          <Image
            source={require("../assets/chatbot.png")}
            style={[styles.videoIcon]}
          />
        </TouchableOpacity>
      </View>

      <View style={{ position: "absolute", top: 130, left: 35 }}>
        <TouchableOpacity style={styles.rewardBox}>
          <Image
            source={require("../assets/reward.png")}
            style={styles.reward}
          />
          <Text style={{ fontSize: 15, color: "gray" }}>우수시설</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // 상대적인 위치로 설정
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 15,
    zIndex: 1,
    borderRadius: 25,
  },
  iconButton: {
    backgroundColor: "white",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
  },
  videoButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 5,
    position: "relative",
  },
  searchButton: {
    position: "absolute",
    width: 340,
    height: 50,
    top: 70,
    right: 20,
    zIndex: 10,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  searchButtonText: {
    color: "gray",
    fontSize: 15,
    paddingLeft: 10,
  },
  icon: {
    width: 27,
    height: 27,
    tintColor: "#fdc500",
  },
  videoIcon: {
    width: 40,
    height: 40,
    tintColor: "#fdc500",
  },
  calloutContainer: {
    flexDirection: "column", // 이미지를 왼쪽에 두고 텍스트를 오른쪽에 배치
    alignItems: "center", // 세로 중앙 정렬
    padding: 5, // 패딩 추가
  },
  calloutImage: {
    width: 70, // 이미지의 너비
    height: 70, // 이미지의 높이
  },
  infoBoxContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100, // Bottom Tab보다 위에 위치하도록 설정
  },
  rewardBox: {
    width: 100,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  reward: {
    width: 25,
    height: 25,
  },
  shadowContainer: {
    position: "absolute",
    // top: location.latitude,  // 위치에 맞게 조정
    // left: location.longitude, // 위치에 맞게 조정
    width: 10, // 원의 크기
    height: 10, // 원의 크기
    borderRadius: 50,
    backgroundColor: "rgba(255, 0, 0, 1)", // 빨간색 배경
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  gaugeContainer: {
    height: 6,
    width: "80%",
    backgroundColor: "#e0e0e0", // 게이지 배경색
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 3,
  },
  gaugeFill: {
    height: "100%",
    borderRadius: 10,
  },
});
