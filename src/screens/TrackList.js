import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ListItem } from "@rneui/themed";

import { useGetTracksQuery } from "../services/api/apiSlice";

const TrackList = ({ navigation }) => {
  const { data } = useGetTracksQuery();

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data?.tracks}
        keyExtractor={(track) => track._id}
        renderItem={({ item: track }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("Track", { id: track._id })}
            >
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{track.name}</ListItem.Title>
                </ListItem.Content>

                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default TrackList;
