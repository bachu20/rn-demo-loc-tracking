import { useDispatch } from "react-redux";
import { Input, Text, Icon, Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

import { setToken } from "../services/auth/authSlice";

const Account = () => {
  const dispatch = useDispatch();

  return (
    <Button type="solid" onPress={() => dispatch(setToken(null))}>
      <Ionicons
        name="ios-log-out-outline"
        size={30}
        color="#fff"
        style={{ marginRight: 5 }}
      />
      Signout
    </Button>
  );
};

export default Account;
