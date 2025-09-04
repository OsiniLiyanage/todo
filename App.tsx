import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SplashScreen } from "./src/Splash";
import { HomeScreen } from "./src/screen/Home";
import { ProfileScreen } from "./src/screen/Profile";
import { Alert, Button } from "react-native";
import { WelcomeScreen } from "./src/screen/Welcome";
import { SigninScreen } from "./src/screen/Signin";
import { SignupScreen } from "./src/screen/Signup";

export type RootParamList = {
  Splash: undefined;
  Home: {
    userId: number;
    email: string;
    name: string;
  };
  Signin: undefined;
  Signup: undefined;
  Welcome: undefined;
  Profile: { userId: number; name: string };
};

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  return (
    <AlertNotificationRoot>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signin"
            component={SigninScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AlertNotificationRoot>
  );
}
