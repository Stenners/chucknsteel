import { StatusBar } from "expo-status-bar";
import { Button } from "react-native";
import { ViewWrapper } from "../../components/viewWrapper";

export function Tools({ navigation }) {
  return (
    <ViewWrapper>
      <Button
        title="Go to Plates"
        onPress={() => navigation.navigate("Plate Calculator")}
      />
    </ViewWrapper>
  );
}
