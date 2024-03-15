import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "./FeedScreen/FeedScreen.main";
import DetailScreen from "./DetailScreen/DetailScreen.main";
import { SocialModel } from "../../../models/social";

// This is a TypeScript Type that defines the parameters of this stack.
// Read More: https://reactnavigation.org/docs/typescript/
export type MainStackParamList = {
  FeedScreen: undefined;
  DetailScreen: { social: SocialModel };
  NewSocialScreen: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();

export function MainStackScreen() {
  const options = { headerShown: false };
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="FeedScreen"
        options={options}
        component={FeedScreen}
      />
      <MainStack.Screen
        name="DetailScreen"
        options={options}
        component={DetailScreen}
      />
    </MainStack.Navigator>
  );
}
