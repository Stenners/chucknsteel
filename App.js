import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HomeScreen } from "./screens/home";
import { LoginScreen } from "./screens/login";
import { Tools } from "./screens/tools";
import { Plates } from "./screens/tools/plates";
import { useState, useEffect } from "react";
import { checkAuth } from "./services/firebase";

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log("onAuthStateChanged", user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const Tab = createBottomTabNavigator();
  const HomeStack = createNativeStackNavigator();

  const ToolsStack = createNativeStackNavigator();

  function ToolsStackScreen() {
    return (
      <ToolsStack.Navigator>
        <ToolsStack.Screen name="Tools" component={Tools} />
        <ToolsStack.Screen name="Plate Calculator" component={Plates} />
      </ToolsStack.Navigator>
    );
  }

  function HomeStackScreen({ route }) {
    console.log("HomeStackScreen", user);
    return (
      <HomeStack.Navigator>
        {user ? (
          <HomeStack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{ user }}
          />
        ) : (
          <HomeStack.Screen name="Login" component={LoginScreen} />
        )}
      </HomeStack.Navigator>
    );
  }

  useEffect(() => {
    checkAuth(onAuthStateChanged);
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "Home":
                iconName = "home-outline";
                break;
              case "Tools":
                iconName = "apps-outline";
              default:
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="A" component={HomeStackScreen} initialParams={user} />
        <Tab.Screen name="B" component={ToolsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
