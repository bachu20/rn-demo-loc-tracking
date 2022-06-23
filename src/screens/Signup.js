import { useState, useReducer, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, Text, Button } from "@rneui/themed";

import { useLoginMutation, useSignupMutation } from "../services/api/apiSlice";

const reducer = (state, action) => {
  switch (action.type) {
    case "MODIFY_EMAIL":
      return { ...state, email: action.payload };
    case "MODIFY_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
};

const initialState = { email: "", password: "" };

const Signup = ({ navigation }) => {
  const [isSignin, setIsSignin] = useState(true);
  const [authState, dispatch] = useReducer(reducer, initialState);

  const [postLogin, loginOptions] = useLoginMutation();
  const [postSignup, signupOptions] = useSignupMutation();

  useLayoutEffect(() => {
    const icon = isSignin ? "ios-log-in-outline" : "ios-person-add-outline";

    navigation.setOptions({
      title: flowType,
      tabBarIcon: ({ color }) => (
        <Ionicons name={icon} size={30} color={color} />
      ),
    });
  }, [isSignin]);

  const helperTxt = isSignin
    ? "Don't have an account? \n Go back to sign up."
    : "Already have an account? \n Sign In instead.";

  const flowType = isSignin ? "Sign In" : "Sign Up";

  const isLoading = isSignin ? loginOptions.isLoading : signupOptions.isLoading;
  const error = isSignin ? loginOptions.error : signupOptions.error;

  const testPayload = {
    email: "cozyachiever123",
    password: "cozy123",
  };

  const handleSignin = async () => {
    // if (!(authState.email && authState.password)) {
    //   return;
    // }

    if (isSignin) {
      return await postLogin(testPayload)
        .unwrap()
        .catch(() => null);
    }

    return await postSignup(authState)
      .unwrap()
      .catch(() => null);
  };

  return (
    <View style={styles.wrapper}>
      <Text h2 h2Style={styles.header}>
        {flowType} for Tracker
      </Text>

      <Input
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Email"
        value={authState.email}
        onChangeText={(email) =>
          dispatch({ type: "MODIFY_EMAIL", payload: email })
        }
      />

      <Input
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Password"
        value={authState.password}
        errorMessage={error && "Something went wrong. Try again later."}
        errorStyle={{ marginLeft: 0 }}
        onChangeText={(password) =>
          dispatch({ type: "MODIFY_PASSWORD", payload: password })
        }
      />

      <Button
        title={flowType}
        type="solid"
        loading={isLoading}
        style={styles.signupBtn}
        onPress={() => handleSignin()}
      />

      <Button
        title={helperTxt}
        type="clear"
        onPress={() => setIsSignin(!isSignin)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200,
  },
  header: {
    marginBottom: 30,
    alignSelf: "center",
  },
  signupBtn: {
    height: 50,
    marginVertical: 15,
    justifyContent: "center",
  },
});

export default Signup;
