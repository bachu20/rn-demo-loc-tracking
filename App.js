import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";

import { store } from "./src/store";
import { useTryLocalLoginMutation } from "./src/services/api/apiSlice";

import Signup from "./src/screens/Signup";
import TrackList from "./src/screens/TrackList";
import TrackDetail from "./src/screens/TrackDetail";
import TrackCreate from "./src/screens/TrackCreate";
import Account from "./src/screens/Account";

const Tab = createBottomTabNavigator();

const screens = [
  { title: "Tracks", component: TrackList, icon: "ios-trail-sign-outline" },
  { title: "New Track", component: TrackCreate, icon: "ios-add-outline" },
  { title: "Account", component: Account, icon: "ios-person-outline" },
  {
    title: "Track",
    component: TrackDetail,
    icon: "ios-map-outline",
    hidden: true,
  },
];

const wrapScreen = (Component) => {
  return (props) => (
    <View style={styles.wrapper}>
      <Component {...props} />
    </View>
  );
};

const App = () => {
  const [postTryLocalLogin, { isLoading }] = useTryLocalLoginMutation();
  const isLoggedIn = useSelector((state) => !!state.auth.access_token);

  useEffect(() => {
    !isLoggedIn && postTryLocalLogin();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Login"
        sceneContainerStyle={{ backgroundColor: "#fff" }}
      >
        {!isLoggedIn ? (
          <Tab.Screen name="Login" component={wrapScreen(Signup)} />
        ) : (
          screens.map((config) => (
            <Tab.Screen
              key={config.title}
              name={config.title}
              component={wrapScreen(config.component)}
              options={{
                tabBarItemStyle: config.hidden && { display: "none" },
                tabBarIcon: ({ color }) => (
                  <Ionicons name={config.icon} size={30} color={color} />
                ),
              }}
            />
          ))
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    paddingTop: 30,
    flex: 1,
  },
});

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
