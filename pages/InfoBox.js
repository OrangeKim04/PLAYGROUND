import React, { useRef, useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Share, Image, PanResponder, Dimensions, ScrollView } from 'react-native';

const SCREEN_HEIGHT = 1065
console.log(SCREEN_HEIGHT);

const InfoRow = styled.View`
    flex-direction: row;
`;

const InfoLabel = styled.Text`
    margin-right: 12px;
    font-weight: bold;
    margin-bottom: 5px;
`;

const InfoValue = styled.Text`
    font-size: 14px;
`;
export default function InfoBox({ marker, slideAnim, toggleFavorite, isFavorite, navigation }) {
    const [boxHeight, setBoxHeight] = useState(550);
    const animatedValue = useRef(new Animated.Value(0)).current;

    // PanResponder 설정
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                // 위로 드래그 시 boxHeight를 늘림
                if (gestureState.dy < 0) {
                    setBoxHeight(prevHeight => Math.min(prevHeight - gestureState.dy, SCREEN_HEIGHT)); // 최대 높이 설정
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                // 드래그가 끝났을 때 애니메이션 처리
                if (gestureState.dy < -100) { // 위로 드래그가 일정량 이상이면
                    Animated.timing(animatedValue, {
                        toValue: -SCREEN_HEIGHT, // 전체 화면을 차지하도록
                        duration: 500,
                        useNativeDriver: true,
                    }).start(() => {
                        setBoxHeight(SCREEN_HEIGHT); // 높이를 전체 화면으로 설정
                    });
                } 
                // else if (gestureState.dy > 80 && boxHeight === SCREEN_HEIGHT) {
                //     // 전체 화면에서 아래로 드래그하면 550으로 되돌림
                //     Animated.timing(animatedValue, {
                //         toValue: 0, // 원래 위치로 돌아감
                //         duration: 500,
                //         useNativeDriver: true,
                //     }).start(() => {
                //         setBoxHeight(550); // 높이를 550으로 설정
                //     });
                // } else {
                //     // 원래 높이로 되돌림
                //     Animated.timing(animatedValue, {
                //         toValue: 0,
                //         duration: 500,
                //         useNativeDriver: true,
                //     }).start(() => {
                //         setBoxHeight(550); // 높이를 550으로 되돌림
                //     });
                // }
            },
        })
    ).current;
    
    const shareAddress = async (address, pfctNm) => {
        try {
            await Share.share({
                message: `[놀이터백과]\n\n[놀이터 정보]\n이름: ${pfctNm}\n주소: ${address}`,
            });
        } catch (error) {
            console.error("Error sharing address:", error);
        }
    };
    const rideImages = {
        '건너는기구': require('../assets/rides/건너는기구.png'), // 건너는기구 이미지
        '충격흡수용표면재(고무바닥재)': require('../assets/rides/고무바닥재.png'),
        '공중놀이기구': require('../assets/rides/공중놀이기구.png'),
        '그네': require('../assets/rides/그네.png'), // 그네 이미지
        '기타': require('../assets/rides/기타.png'), // 기타 이미지
        '충격흡수용표면재(기타바닥재)': require('../assets/rides/기타바닥재.png'), 
        '늑목': require('../assets/rides/늑목.png'), 
        '충격흡수용표면재(모래)': require('../assets/rides/모래.png'), // 충격흡수용표면재(모래) 이미지
        '미끄럼틀': require('../assets/rides/미끄럼틀.png'), 
        '스페이스네트': require('../assets/rides/스페이스네트.png'), 
        '오르는기구': require('../assets/rides/오르는기구.png'), 
        '정글짐': require('../assets/rides/정글짐.png'), 
        '조합놀이대': require('../assets/rides/조합놀이대.png'), // 조합놀이대 이미지
        '철봉': require('../assets/rides/철봉.png'), 
        '폐쇄형놀이기구': require('../assets/rides/폐쇄형 놀이기구.png'), 
        '충격흡수용표면재(포설도포바닥재)': require('../assets/rides/포설도포바닥재.png'), 
        '회전놀이기구': require('../assets/rides/회전놀이기구.png'), 
        '흔들놀이기구': require('../assets/rides/흔들놀이기구.png'), 
   
        // 필요한 모든 기구종류에 대한 이미지 경로 추가
    };
    

    return (
        <Animated.View style={[styles.infoBox, { height: boxHeight, transform: [{ translateY: slideAnim }] }]}>
               <ScrollView 
                {...panResponder.panHandlers} 
                style={[styles.container, { marginTop: boxHeight === SCREEN_HEIGHT ? 55 : 10 }]}
                contentContainerStyle={{ paddingBottom: 20 }}
                scrollEnabled={boxHeight === SCREEN_HEIGHT} // 높이에 따라 스크롤 가능 여부 설정
                onScroll={({ nativeEvent }) => {
                    // 스크롤이 최상단인지 확인
                    if (nativeEvent.contentOffset.y === 0 && boxHeight === SCREEN_HEIGHT) {
                        // 최상단에 있을 때만 boxHeight를 줄임
                        setBoxHeight(550);
                    }
                }}
                scrollEventThrottle={16} // 스크롤 이벤트 호출 간격 설정
            >
                <Text style={styles.title}>{marker.pfctNm}</Text>



                <View style={styles.func}>
                <View style={{ width: 130, height: 13, marginRight: 100, marginLeft: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {Array.from({ length: marker.score }, (_, index) => (
                                <Image
                                    key={index} // 고유한 키를 지정해야 합니다
                                    source={require('../assets/score.png')}
                                    style={{ width: 12, height: 12, marginLeft: 2 }} // 이미지 사이에 여백을 추가할 수 있습니다
                                />
                            ))}
                            {Array.from({ length: 10-marker.score }, (_, index) => (
                                <Image
                                    key={index} // 고유한 키를 지정해야 합니다
                                    source={require('../assets/blank.png')}
                                    style={{ width: 11, height: 11, marginLeft: 2 }} // 이미지 사이에 여백을 추가할 수 있습니다
                                />
                            ))}
                        </View>
                    </View>
                    <View style={{marginRight: 10, flexDirection: 'row', justifyContent: 'row-reverse'}}>
                    {/* 주소 공유 버튼 */}
                    <TouchableOpacity onPress={() => shareAddress(marker.ronaAddr, marker.pfctNm)} style={[styles.Button]}>
                        <Image 
                            source={require('../assets/share-button.png')} // 공유 아이콘의 경로
                            style={styles.ButtonImage} // 스타일 추가
                        />
                    </TouchableOpacity>

                    {/* 즐겨찾기 토글 버튼 */}
                    <TouchableOpacity onPress={() => toggleFavorite(marker)} style={styles.Button}>
                        <Image 
                            source={isFavorite ? require('../assets/after-favorite.png') : require('../assets/before-favorite.png')} // 즐겨찾기 이미지
                            style={styles.ButtonImage} // 스타일 추가
                        />
                    </TouchableOpacity>
                    </View>
                    
                   

                    
                </View>

               




                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                    {marker.pfctSn &&
                        <View style={styles.tag}>
                            <Text style={{fontSize: '15', color: '#A58100'}}>시설번호: {marker.pfctSn}</Text>
                        </View>
                    }
                    {marker.instlPlaceCdNm &&
                        <View style={[styles.tag, {marginLeft: 5}]}>
                            <Text style={{fontSize: '15', color: '#A58100'}}>{marker.instlPlaceCdNm}</Text>
                        </View>
                    }
                      {/* 리뷰 */}
                      <TouchableOpacity onPress={() => navigation.navigate('ReviewPage', {marker})} style={[styles.tag, {marginLeft: 80, backgroundColor: '#FC9A00' }]}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>리뷰</Text>
                    </TouchableOpacity>
                </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{backgroundColor: '#fdc500', height: 1, marginTop: 10, marginBottom: 20, width: 300}}></View>
                    </View>

                
                {marker.ronaAddr && 
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginRight: 40, marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>주소</Text>
                        </View>
                        <View style={{ flex: 1}}>
                            <Text style={{fontSize: 15}}>{marker.ronaAddr}</Text>
                        </View>
                    </View>
                
                }

                {marker.instlYmd && (
                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                        <View style={{ marginRight: 15, marginLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{ fontWeight: 'bold' , fontSize: 15}}>설치일자</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{fontSize: 15}}>
                                {`${String(marker.instlYmd).slice(0, 4)}.${String(marker.instlYmd).slice(4, 6)}.${String(marker.instlYmd).slice(6, 8)}`}
                            </Text>
                        </View>
                    </View>
                )}
                <View style={{backgroundColor: '#FDC500', height: 1, marginTop: 80, marginBottom: 30}}></View>

                {marker.ride_descriptions && (() => {
                    // 놀이기구 정보 파싱
                    const rides = marker.ride_descriptions.split(', ').map(ride => {
                        const [id, name] = ride.split(' - ');
                        return { id, name };
                    });

                    // 놀이기구 개수 세기
                    const rideCount = rides.reduce((acc, ride) => {
                        acc[ride.name] = (acc[ride.name] || 0) + 1;
                        return acc;
                    }, {});

                    // 기타 항목과 나머지 항목 분리
                    const { 기타, ...otherRides } = rideCount;
                    const 기타Count = 기타 || 0; // 기타가 없으면 0으로 초기화

                    return (
                        <View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{ width: 320, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#FFF0BA', padding: 5, paddingVertical: 8,borderRadius: 20, marginTop: 20, justifyContent: 'center'}}>
                                {Object.entries(otherRides).map(([name, count], index) => (
                                    <View key={index} style={{ flexDirection: 'row', margin: 5, backgroundColor: 'white', padding: 7, paddingHorizontal: 10, borderRadius: 20 }}>
                                        <Text style={{fontSize: 14}}>{name}</Text>
                                        <Text style={{marginLeft: 5, fontWeight: 'bold', color: '#DEAE00'}}>{count}</Text>
                                    </View>
                                ))}
                                {기타Count > 0 && ( // 기타가 있을 경우에만 출력
                                    <View style={{flexDirection: 'row', margin: 5, backgroundColor: 'white', padding: 7, paddingHorizontal:10, borderRadius: 20 }}>
                                        <Text style={{fontSize: 14}}>기타</Text>
                                        <Text style={{marginLeft: 5, fontWeight: 'bold', color: '#DEAE00'}}>{기타Count}</Text>
                                    </View>
                                )}
                            </View>
                            
                        </View>

                         {/* 기구번호와 기구종류 출력 */}
                         <Text style={{marginTop: 40, marginLeft: 5, fontSize: 20, fontWeight: 'bold', color: '#DEAE00'}}>놀이기구</Text>
                         <View style={{marginTop: 10, marginLeft: 5, padding: 3}}>
                            {rides.map((ride, index) => (
                                <View key={index} style={{ flexDirection: 'row', margin: 10, alignItems: 'center'}}>
                                    <Image
                                        source={rideImages[ride.name] || rideImages['기타']} // 해당 기구종류의 이미지 또는 기타 이미지
                                        style={{ width: 50, height: 50, marginRight: 18 }} // 이미지 크기 조절
                                    />
                                    <View style={{flexDirection: 'column', flexWrap: 'wrap', flexShrink: 1}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 10, fontWeight: 'bold', marginBottom: 5}}>기구번호</Text>
                                            <Text style={{marginBottom: 5}}>{ride.id}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={{marginRight: 10, fontWeight: 'bold'}}>기구종류</Text>
                                            <Text>{ride.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                        
                        </View>
                    );
                })()}
                
                <View style={{backgroundColor: '#FDC500', height: 1, marginVertical: 30}}></View>

                {marker.inspKndCdNm && 
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={styles.inpContainer}>
                            <InfoLabel style={{marginBottom: 10}}>안전검사</InfoLabel>
                            <InfoRow>
                                <InfoLabel>검사종류</InfoLabel>
                                <InfoValue>{marker.inspKndCdNm}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>유효일자</InfoLabel>
                                <InfoValue>{`${marker.vldYmd.toString().slice(0, 4)}.${marker.vldYmd.toString().slice(4, 6)}.${marker.vldYmd.toString().slice(6, 8)}`}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>통과여부</InfoLabel>
                                <InfoValue>{marker.passYn === 'Y' ? '통과' : '미통과'}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>검사일자</InfoLabel>
                                <InfoValue>{`${marker.inspYmd.toString().slice(0, 4)}.${marker.inspYmd.toString().slice(4, 6)}.${marker.inspYmd.toString().slice(6, 8)}`}</InfoValue>
                            </InfoRow>
                        </View> 
                    </View>
                }

                <View style={{backgroundColor: '#FDC500', height: 1, marginVertical: 30}}></View>

                {marker.insrncMngSn && 
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={styles.inpContainer}>
                            <InfoLabel style={{marginBottom: 10}}>보험</InfoLabel>
                            <InfoRow>
                                <InfoLabel>보험관리번호</InfoLabel>
                                <InfoValue>{marker.insrncMngSn}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel style={{marginRight: 35}}>가입일자</InfoLabel>
                                <InfoValue>{marker.joinYmd}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel style={{marginRight: 35}}>만료일자</InfoLabel>
                                <InfoValue>{marker.mtryYmd}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel style={{marginRight: 46}}>보험사</InfoLabel>
                                <InfoValue>{marker.insu}</InfoValue>
                            </InfoRow>
                        </View>
                    </View>
                }
                
                <View style={{height: 300}}></View>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    infoBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 10,
    },
    container: {
        flex: 1,
        paddingBottom: 100,
    }, 
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 5,
        marginTop: 5,
    },
    tag: { // 시설번호, 주택단지
        backgroundColor: '#FFF0BA',
        height: 32,
        padding: 5,
        borderRadius: 10,
        marginTop: 10,
        padding: 7, 
        paddingHorizontal:10,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    func: { // 즐겨찾기, 공유
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    Button: {
        width: 30,
        height: 30,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonImage: {
        width: 23, // 이미지의 너비
        height: 23, // 이미지의 높이
        tintColor: '#fdc500', // 이미지의 색상
    },
    inpContainer: {
        width: 320,
        borderWidth: 1,
        borderRadius: 20,
        padding: 17,
        borderColor: '#FDC500',
    }, 
});

