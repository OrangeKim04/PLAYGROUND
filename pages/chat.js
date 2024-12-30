import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const { height, width } = Dimensions.get('window');

// 미리 정의된 놀이 데이터
const playData = [
    {
      name: "숨바꼭질",
      description: 
        "한 명이 술래가 되어 다른 사람들을 찾아다니는 놀이입니다. " + 
        "술래는 눈을 감고 30초 동안 숫자를 세며, 그동안 나머지 사람들은 숨을 곳을 찾아야 합니다. " +
        "술래가 모든 사람을 찾으면 가장 먼저 잡힌 사람이 다음 술래가 됩니다.",
      players: "2명 이상",
      minPlayers: 2, // 최소 2명 필요
      location: "실내/실외",
    },
    {
      name: "그네 타기",
      description: 
        "그네에 앉아 친구들과 누가 더 높이 올라가는지 경쟁하거나, " +
        "누가 가장 오래 탈 수 있는지 대결해보세요. " +
        "그네에서 떨어지지 않도록 안전에 주의하세요.",
      players: "1명 이상",
      minPlayers: 1, // 최소 1명 필요
      location: "실외",
    },
    {
      name: "모래성 쌓기",
      description: 
        "모래를 사용해 성이나 다양한 조형물을 만들어 보세요. " + 
        "버킷과 삽을 사용해 성의 구조를 설계하고, " +
        "각자 역할을 나눠 협력하여 거대한 성을 완성할 수도 있습니다. " +
        "가장 독창적인 작품을 만들어 친구들과 평가해 보세요.",
      players: "1명 이상",
      minPlayers: 1, // 최소 1명 필요
      location: "모래 놀이터",
    },
    {
      name: "술래잡기",
      description: 
        "술래는 정해진 구역 안에서 다른 사람들을 잡아야 합니다. " +
        "술래에게 잡힌 사람은 탈락하며, 마지막까지 잡히지 않은 사람이 승리합니다. " +
        "구역을 벗어난 사람은 자동으로 탈락 처리됩니다.",
      players: "3명 이상",
      minPlayers: 3, // 최소 3명 필요
      location: "실외",
    },
    {
      name: "땅따먹기",
      description: 
        "땅에 큰 사각형을 그리고 그 안을 여러 칸으로 나눕니다. " +
        "자신의 칸에 돌을 던진 후, 한 발로만 뛰어다니며 돌을 회수합니다. " +
        "모든 칸을 돌며 성공하면 점수를 얻고, 실패하면 다음 사람이 도전합니다. " +
        "가장 많은 점수를 얻은 사람이 승리합니다.",
      players: "2명 이상",
      minPlayers: 2, // 최소 2명 필요
      location: "실외",
    },
    {
      name: "줄넘기",
      description: 
        "줄을 돌리며 일정한 리듬에 맞춰 뛰는 놀이입니다. " +
        "개인전에서는 제한 시간 내에 누가 가장 많이 뛸 수 있는지 겨루고, " +
        "단체전에서는 긴 줄을 여러 사람이 함께 넘으며 팀워크를 발휘합니다.",
      players: "1명 이상",
      minPlayers: 1, // 최소 1명 필요
      location: "실외",
    },
    {
      name: "고무줄 놀이",
      description: 
        "고무줄을 두 사람의 발목에 걸고, 나머지 한 사람이 다양한 동작으로 고무줄을 넘거나 밟습니다. " +
        "고무줄 높이는 무릎, 허리 등으로 점점 올라가며 난이도가 높아집니다. " +
        "동작에 실패하면 다른 사람이 도전하고, 가장 오래 성공한 사람이 승리합니다.",
      players: "3명 이상",
      minPlayers: 3, // 최소 3명 필요
      location: "실외",
    },
    {
      name: "동네 야구",
      description: 
        "작은 팀을 만들어 서로 대결합니다. 타자는 나무 배트나 플라스틱 배트를 사용하며, " +
        "공을 던지고 치며 베이스를 돌며 점수를 얻습니다. " +
        "정해진 이닝 동안 더 많은 점수를 얻은 팀이 승리합니다. " +
        "안전 사고를 방지하기 위해 충분히 넓은 공간에서 진행해야 합니다.",
      players: "6명 이상",
      minPlayers: 6, // 최소 6명 필요
      location: "운동장",
    },
    {
      name: "얼음 땡",
      description: 
        "술래가 사람을 잡으면 '얼음' 상태가 되어 움직일 수 없습니다. " +
        "다른 사람이 '땡'을 외치며 얼음을 풀어주면 다시 움직일 수 있습니다. " +
        "모든 사람이 얼음이 되면 술래가 승리합니다.",
      players: "3명 이상",
      minPlayers: 3, // 최소 3명 필요
      location: "실외",
    },
    {
      name: "줄다리기",
      description: 
        "두 팀으로 나뉘어 줄을 잡고 상대 팀을 정해진 선 밖으로 당기는 놀이입니다. " +
        "줄을 잡을 때는 균형을 잘 맞추고, 팀원들과 힘을 합쳐야 승리할 수 있습니다.",
      players: "4명 이상",
      minPlayers: 4, // 최소 4명 필요
      location: "실외",
    },
    {
      name: "풍선 터뜨리기",
      description: 
        "각 참가자는 풍선을 불어 일정 크기 이상으로 만든 후 터뜨립니다. " +
        "가장 빠르게 터뜨린 사람이 승리합니다. 안전을 위해 풍선을 조심히 다룹니다.",
      players: "2명 이상",
      minPlayers: 2, // 최소 2명 필요
      location: "실외",
    },
  ];
  

  function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const [awaitingPlayers, setAwaitingPlayers] = useState(false); // 인원수 대기 상태
  
    useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: '안녕하세요! 무엇이든 물어보세요.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Chatbot',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ]);
    }, []);
  
    const recommendPlay = (numPlayers) => {
      const filteredPlays = playData.filter((play) => numPlayers >= play.minPlayers);
      if (filteredPlays.length > 0) {
        const recommendedPlay = filteredPlays[Math.floor(Math.random() * filteredPlays.length)];
        return `추천 놀이: ${recommendedPlay.name}\n${recommendedPlay.description}\n인원: ${recommendedPlay.players}\n장소: ${recommendedPlay.location}`;
      } else {
        return "해당 인원에 적합한 놀이가 없습니다.";
      }
    };
  
    const handleUserMessage = (userMessage) => {
      if (awaitingPlayers) {
        const numPlayers = parseInt(userMessage);
        if (!isNaN(numPlayers) && numPlayers > 0) {
          const response = recommendPlay(numPlayers);
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              {
                _id: Math.random().toString(36).substr(2, 9),
                text: response,
                createdAt: new Date(),
                user: { _id: 2, name: 'Chatbot' },
              },
            ])
          );
        } else {
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              {
                _id: Math.random().toString(36).substr(2, 9),
                text: '유효한 숫자를 입력해주세요!',
                createdAt: new Date(),
                user: { _id: 2, name: 'Chatbot' },
              },
            ])
          );
        }
        setAwaitingPlayers(false);
      } else if (userMessage.includes("추천") || userMessage.includes("놀이")) {
        setAwaitingPlayers(true);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.random().toString(36).substr(2, 9),
              text: '몇 명이서 놀 예정인가요?',
              createdAt: new Date(),
              user: { _id: 2, name: 'Chatbot' },
            },
          ])
        );
      } else {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.random().toString(36).substr(2, 9),
              text: '잘 이해하지 못했어요. "추천"이나 "놀이"를 포함한 질문을 해주세요!',
              createdAt: new Date(),
              user: { _id: 2, name: 'Chatbot' },
            },
          ])
        );
      }
    };
  
    const onSend = useCallback((messages = []) => {
      const userMessage = messages[0].text;
  
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
  
      handleUserMessage(userMessage);
    }, [awaitingPlayers]);
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>뭐하고 놀까?</Text>
        </View>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{ _id: 1 }}
          placeholder="메세지를 입력하세요..."
          alwaysShowSend={true}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFE792' },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      width: width,
      top: 5,
      zIndex: 10,
      backgroundColor: '#FFE792',
      paddingTop: 80,
    },
    headerText: { fontSize: 30, fontWeight: '900' },
  });
  
  export default ChatScreen;