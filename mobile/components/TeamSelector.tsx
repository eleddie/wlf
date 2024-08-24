import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TeamData } from "@/types";

type TeamSelectorProps = {
  readonly teams: TeamData[];
  readonly team?: string;
  readonly setTeam: (team: string) => void;
};

const TeamSelector = ({ teams, team, setTeam }: TeamSelectorProps) => {
  const renderItem = (item: TeamData) => {
    return (
      <View style={styles.item}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="contain"
        />
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };

  const renderLeftIcon = () => {
    const teamLogo = teams.find((t) => t.slug === team)?.image;
    if (!teamLogo)
      return (
        <MaterialCommunityIcons
          name="soccer"
          size={24}
          color="black"
          style={styles.icon}
        />
      );
    return (
      <Image
        source={{ uri: teamLogo ?? "" }}
        style={styles.image}
        contentFit="contain"
      />
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={teams}
      labelField="name"
      valueField="slug"
      placeholder="Select team"
      value={team}
      onChange={(item) => setTeam(item.slug)}
      renderLeftIcon={renderLeftIcon}
      renderItem={renderItem}
    />
  );
};

export default TeamSelector;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  image: {
    width: 24,
    height: 24,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  item: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  textItem: {
    flex: 1,
    fontSize: 20,
    color: "#333",
  },
  placeholderStyle: {
    fontSize: 20,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 20,
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
