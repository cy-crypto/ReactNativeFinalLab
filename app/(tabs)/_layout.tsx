import React from 'react';
import { Tabs, useRouter, Slot } from 'expo-router';
import { BookOpen, UserPlus, MessageCircle, Menu } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';

export default function TabLayout() {
  const [navType, setNavType] = useState<'bottom' | 'sidebar'>('bottom');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const sidebarAnim = useRef(new Animated.Value(-200)).current; // Sidebar width is 200
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchNav = async () => {
      const { data, error } = await supabase
        .from('NAVTABLE')
        .select('NAV')
        .order('id', { ascending: false })
        .limit(1);
      console.log('NAVTABLE data:', data, 'error:', error);
      if (!error && data && data.length > 0) {
        if (data[0].NAV === 'sidebar') setNavType('sidebar');
        else setNavType('bottom');
      }
    };
    fetchNav();
    // Optionally, subscribe to changes in NAV for real-time switching
    const channel = supabase
      .channel('public:NAVTABLE')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'NAVTABLE' }, fetchNav)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarAnim, {
        toValue: -200,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => setSidebarOpen(false));
  };

  if (navType === 'sidebar') {
    return (
      <View style={{ flex: 1 }}>
        {/* Hamburger menu button */}
        <TouchableOpacity style={styles.hamburger} onPress={openSidebar}>
          <Menu size={32} color="#007AFF" />
        </TouchableOpacity>
        {/* Main content with low opacity when sidebar is open */}
        <Animated.View style={{ flex: 1, opacity: sidebarOpen ? 0.3 : 1 }} pointerEvents={sidebarOpen ? 'none' : 'auto'}>
          <Slot />
        </Animated.View>
        {/* Overlay and animated sidebar */}
        {sidebarOpen && (
          <>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar}>
              <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
            </Pressable>
            <Animated.View style={[styles.animatedSidebar, { left: sidebarAnim }]}> 
              <View style={styles.sidebar}>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => { router.navigate('./index'); closeSidebar(); }}>
                  <BookOpen size={24} color="#007AFF" />
                  <Text style={styles.sidebarText}>Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => { router.navigate('./register'); closeSidebar(); }}>
                  <UserPlus size={24} color="#007AFF" />
                  <Text style={styles.sidebarText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => { router.navigate('./chats'); closeSidebar(); }}>
                  <MessageCircle size={24} color="#007AFF" />
                  <Text style={styles.sidebarText}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={() => { router.navigate('./group-chat'); closeSidebar(); }}>
                  <MessageCircle size={24} color="#007AFF" />
                  <Text style={styles.sidebarText}>Group Chat</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        )}
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Courses',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'Register',
          tabBarIcon: ({ size, color }) => (
            <UserPlus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  animatedSidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
    zIndex: 30,
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    paddingHorizontal: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sidebarText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});