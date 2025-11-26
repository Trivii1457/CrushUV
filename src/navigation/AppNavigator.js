import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';

// Main Screens
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import MatchesScreen from '../screens/matches/MatchesScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import CreateProfileScreen from '../screens/profile/CreateProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

import {colors} from '../theme';
import {useAuth} from '../context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused, color, size) => {
  let iconName;

  if (routeName === 'Discover') {
    iconName = focused ? 'flame' : 'flame-outline';
  } else if (routeName === 'Matches') {
    iconName = focused ? 'heart' : 'heart-outline';
  } else if (routeName === 'Chat') {
    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  } else if (routeName === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}>
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{title: 'Descubrir'}} />
      <Tab.Screen name="Matches" component={MatchesScreen} options={{title: 'Matches'}} />
      <Tab.Screen name="Chat" component={ChatListScreen} options={{title: 'Chats'}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{title: 'Perfil'}} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const {isAuthenticated, loading} = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default AppNavigator;
