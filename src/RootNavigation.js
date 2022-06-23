import { CommonActions } from "@react-navigation/native";

let navigatorRef;

export const setNavigatorRef = (ref) => {
  navigatorRef = ref;
};

export const navigate = (routeName, params) => {
  if (!navigatorRef) return;
  navigatorRef.dispatch(CommonActions.navigate({ name: routeName, params }));
};
