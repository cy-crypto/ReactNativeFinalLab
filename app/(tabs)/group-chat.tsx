import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { MicOff, User, HandMetal, X } from 'lucide-react-native';

const messages = [
  { id: '1', sender: 'Ali', text: 'Hey everyone!', time: '16:30', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', sender: 'Sara', text: 'Hi Ali! Ready for the group call?', time: '16:31', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', sender: 'Ali', text: "Yes, let's start!", time: '16:32', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
];

const personDP = 'https://randomuser.me/api/portraits/men/4.jpg';

export default function GroupChatScreen() {
  const [showPopup, setShowPopup] = useState(false);
  const panY = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -20,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          panY.setValue(Dimensions.get('window').height + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -80) {
          setShowPopup(true);
          Animated.timing(panY, {
            toValue: Dimensions.get('window').height - 260,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(panY, {
            toValue: Dimensions.get('window').height,
            duration: 200,
            useNativeDriver: false,
          }).start(() => setShowPopup(false));
        }
      },
    })
  ).current;

  const closePopup = () => {
    Animated.timing(panY, {
      toValue: Dimensions.get('window').height,
      duration: 200,
      useNativeDriver: false,
    }).start(() => setShowPopup(false));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.messageRow, item.sender === 'Ali' ? styles.myMessage : styles.otherMessage]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageBubble}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />
      {/* Drag area at the bottom */}
      <Animated.View
        style={[styles.dragArea, { bottom: 0 ,opacity: 0}]}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragHandle} />
        <Text style={styles.dragText}>Drag up for group call options</Text>
      </Animated.View>
      {/* Popup Bottom Sheet */}
      {showPopup && (
        <Animated.View style={[styles.popup, { top: panY }]}> 
          <View style={styles.popupContent}>
            <TouchableOpacity style={styles.muteButton}>
              <MicOff size={28} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: personDP }} style={styles.dp} />
            <HandMetal size={28} color="#25D366" style={styles.waveIcon} />
            <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.noOneText}>No one else is here yet…</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  myMessage: {
    justifyContent: 'flex-start',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
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
  time: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  dragArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dragHandle: {
    display: 'none',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    marginBottom: 6,
  },
  dragText: {
    color: '#888',
    fontSize: 13,
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
}); 