import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl, Alert, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated, PanResponder, Dimensions, ActivityIndicator } from 'react-native';
import { HandMetal, MicOff, X, ArrowUp } from 'lucide-react-native';

const dummyChats = [
  {
    id: '1',
    name: 'React Native Group',
    lastMessage: "Let's finish the project!",
    time: '16:30',
    unread: 2,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'MAD Lab',
    lastMessage: 'Assignment due tomorrow.',
    time: '15:10',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Study Buddies',
    lastMessage: 'Group call at 5pm?',
    time: '14:05',
    unread: 1,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const autoReplies = [
  'Hello!',
  'How are you?',
  "Let's do it!",
  'I agree!',
  'See you soon!',
  'Great idea!',
  'I am on it!',
  'Thanks for the update!',
];

const personDP = 'https://randomuser.me/api/portraits/men/4.jpg';

export default function ChatsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const panY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const [arrowScale, setArrowScale] = useState(new Animated.Value(1));
  const arrowY = useRef(new Animated.Value(0)).current;
  const arrowOpacity = useRef(new Animated.Value(0.7)).current;
  const [arrowVisible, setArrowVisible] = useState(false);
  const ARROW_MAX_DRAG = Dimensions.get('window').height / 4;

  // PanResponder for drag-to-popup
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -10,
      onPanResponderGrant: () => {
        setArrowVisible(true);
        Animated.timing(arrowOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          // Arrow moves up at 15% of drag speed, max 1/4 screen
          const dragDistance = Math.abs(gestureState.dy);
          const arrowMove = -Math.min(dragDistance * 0.15, ARROW_MAX_DRAG);
          arrowY.setValue(arrowMove);
          const scale = 0.3 + 0.9 * Math.min(dragDistance / ARROW_MAX_DRAG, 1);
          arrowScale.setValue(scale);
          arrowOpacity.setValue(0.7 + 0.3 * Math.min(dragDistance / ARROW_MAX_DRAG, 1));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) > ARROW_MAX_DRAG) {
          setArrowVisible(false);
          Animated.parallel([
            Animated.timing(arrowOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
          // Show loader and popup only after release
          setTimeout(() => {
            setLoadingPopup(true);
            setTimeout(() => {
              setLoadingPopup(false);
              panY.setValue(Dimensions.get('window').height - 260);
              setShowPopup(true);
            }, 1000);
          }, 0);
        } else {
          Animated.parallel([
            Animated.timing(arrowY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(arrowScale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(arrowOpacity, {
              toValue: 0.7,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start(() => setArrowVisible(false));
          setShowPopup(false);
          setLoadingPopup(false);
        }
      },
    })
  ).current;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Group Call', 'This would start a group call (mock action)!');
    }, 1200);
  };

  const openChat = (chat: any) => {
    setActiveChat(chat);
    setMessages([
      { id: '1', sender: chat.name, text: chat.lastMessage, time: chat.time, avatar: chat.avatar },
    ]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'You',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    // Auto-reply after a short delay
    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: activeChat?.name || 'Bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: activeChat?.avatar,
        },
      ]);
    }, 1200);
  };

  const renderChatList = () => (
    <FlatList
      data={dummyChats}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.time}>{item.time}</Text>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );

  const renderGroupChat = () => (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.sender === 'You' ? styles.myMessage : styles.otherMessage]}>
            {item.sender !== 'You' && item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : null}
            <View style={styles.messageBubble}>
              <Text style={styles.sender}>{item.sender}:</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputBarContainer}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            placeholderTextColor="#888"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {arrowVisible && !showPopup && !loadingPopup && (
        <Animated.View style={[styles.arrowContainer, {
          transform: [
            { scale: arrowScale },
            { translateY: arrowY },
          ],
          opacity: arrowOpacity,
        }] }>
          <ArrowUp size={36} color="#25D366" />
        </Animated.View>
      )}
      {loadingPopup && !showPopup && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#25D366" />
        </View>
      )}
      {showPopup && !loadingPopup && (
        <Animated.View style={[styles.popup, { top: panY }]}> 
          <View style={styles.popupContent}>
            <TouchableOpacity style={styles.muteButton}>
              <MicOff size={28} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: personDP }} style={styles.dp} />
            <HandMetal size={28} color="#25D366" style={styles.waveIcon} />
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              Animated.timing(panY, {
                toValue: Dimensions.get('window').height,
                duration: 200,
                useNativeDriver: false,
              }).start(() => {
                setShowPopup(false);
                setLoadingPopup(false);
                setArrowVisible(false);
              });
            }}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.noOneText}>No one else is here yet…</Text>
        </Animated.View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {activeChat ? renderGroupChat() : renderChatList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  meta: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sender: {
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    color: '#222',
  },
  inputBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  popup: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    paddingTop: 24,
    zIndex: 20,
  },
  popupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 18,
  },
  muteButton: {
    backgroundColor: '#888',
    borderRadius: 24,
    padding: 12,
    marginHorizontal: 8,
  },
  dp: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#25D366',
  },
  waveIcon: {
    marginHorizontal: 8,
  },
  closeButton: {
    backgroundColor: '#E53935',
    borderRadius: 24,
    padding: 12,
    marginHorizontal: 8,
  },
  noOneText: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  arrowContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
}); 