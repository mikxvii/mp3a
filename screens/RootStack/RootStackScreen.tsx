import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MainStackScreen } from "./MainStack/MainStackScreen";
import NewSocialScreen from "./NewSocialScreen/NewSocialScreen.main";
import { NavigationContainer } from "@react-navigation/native";

// In Part A, our app just has a RootStack.
// In Part B, we're going to add an AuthStack as well, and we'll
// be able to switch between the two via EntryStackScreen.

// This RootStackScreen follows the Modal-Navigation Structure we saw in MP 2.
// Read More: https://reactnavigation.org/docs/modal/

// The "MainStackScreen" holds the FeedScreen and DetailScreen.
// The "NewSocialScreen" is presented MODALLY (it slides up on top).

// Notice how we structure the project directory (the /screens folder)
// to match our navigation stack. This makes things a lot easier to find in large projects!

// This is a TypeScript Type that defines the parameters of this stack.
// Read More: https://reactnavigation.org/docs/typescript/
export type RootStackParamList = {
  Main: undefined;
  NewSocialScreen: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootStackScreen() {
  // We explicitly set headerShown to false for all of our screens,
  // since we want to render a CUSTOM header view instead of the default
  // one that React Navigation gives us.
  const options = { headerShown: false };
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ presentation: "modal" }}
        initialRouteName="Main"
      >
        <RootStack.Screen
          name="Main"
          component={MainStackScreen}
          options={options}
        />
        <RootStack.Screen
          name="NewSocialScreen"
          options={options}
          component={NewSocialScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
