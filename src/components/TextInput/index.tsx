/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from "react";
import { KeyboardTypeOptions, Pressable, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import CustomText from "../CustomText";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const Wrapper = styled.View<{
  width?: number;
  active?: boolean;
  marginTop?: number;
}>`
  height: 56px;
  width: ${(props) => props?.width || 100}%;
  border-width: 2px;
  border-color: ${(props) =>
    props?.active ? "rgba(18,0,55, 0.6)" : Colors?.border};
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${(props) => props?.marginTop || 0}px;
  padding-horizontal: 12px;
  z-index: 4;
`;

const DisabledView = styled.Pressable<{
  width?: number;
  marginTop?: number;
}>`
  height: 56px;
  width: ${(props) => props?.width || 100}%;
  margin-top: ${(props) => props?.marginTop || 0}px;
  z-index: 6;
  position: absolute;
  background-color: rgba(0, 0, 0, 0);
`;

const TextWrap: any = styled.TextInput`
  height: 100%;
  width: 100%;
  font-family: ${Fonts?.PoppinsRegular};
  font-size: 14px;
  font-weight: 400;
  color: ${Colors?.white};
  align-items: center;
`;

type TextInputProps = {
  marginTop?: number;
  placeholder?: string;
  placeholderTextColor?: string;
  inputType?: KeyboardTypeOptions;
  returnValue?: boolean;
  handleChange?: ((e: string) => void) | undefined;
  name?: string;
  errors?: string;
  value: string;
  showNaira?: boolean;
  onWrapPress?: ((e: boolean) => void) | undefined;
  disabled?: boolean;
  wrapperStyle?: ViewStyle;
};

const TextInput = ({
  marginTop = 0,
  placeholder = "",
  placeholderTextColor = Colors.grey_2,
  inputType = "default",
  returnValue = false,
  handleChange = () => {},
  name = "",
  errors = "",
  value,
  showNaira = false,
  onWrapPress,
  disabled,
  wrapperStyle,
}: TextInputProps) => {
  const [focused, setFocused] = useState(false);

  const translateY = useSharedValue(value.length > 0 ? 18 : 46);
  const animatedIndex = useSharedValue(value.length > 0 ? 5 : 0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      zIndex: animatedIndex?.value,
    };
  });

  useEffect(() => {
    if (focused) {
      translateY.value = withTiming(18);
      animatedIndex.value = withTiming(5);
    }
  }, [focused, translateY, animatedIndex]);

  useEffect(() => {
    if (errors.length > 0) {
      setFocused(false);
    }
  }, [errors]);

  return (
    <Pressable style={wrapperStyle}>
      {disabled && (
        <DisabledView
          onPress={() => {
            onWrapPress && onWrapPress(true);
          }}
          marginTop={marginTop}
        />
      )}

      <Animated.View style={[animatedStyles, { zIndex: animatedIndex?.value }]}>
        <CustomText
          style={{
            zIndex: 3,
            backgroundColor: Colors.bg_black,
            alignSelf: "flex-start",
            paddingHorizontal: 6,
            marginLeft: 9,
          }}
          fontFamily={Fonts.PoppinsMedium}
          bottom={4}
          fontSize={14}
          fontWeight="600"
          color={focused ? Colors?.white : placeholderTextColor}
        >
          {placeholder}
        </CustomText>
      </Animated.View>

      <Wrapper active={focused}>
        {showNaira && (
          <CustomText
            color={Colors.grey_2}
            align="left"
            right={5}
            fontWeight="800"
            fontSize={14}
            fontFamily={Fonts.PoppinsBold}
          >
            ₦
          </CustomText>
        )}

        <TextWrap
          placeholder={""}
          keyboardType={inputType}
          onChangeText={
            returnValue
              ? (e: string) => {
                  handleChange(e);
                }
              : handleChange(name)
          }
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
          }}
          value={value}
        />
      </Wrapper>
      {errors.length > 0 && (
        <View>
          <CustomText
            fontWeight="500"
            top={4}
            left={5}
            fontFamily={Fonts?.PoppinsMedium}
            fontSize={13}
            color={Colors.error}
          >
            {errors}
          </CustomText>
        </View>
      )}
    </Pressable>
  );
};

export default TextInput;
