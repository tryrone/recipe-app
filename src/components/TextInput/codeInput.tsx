import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Text from "react-native-text";

import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import styled from "styled-components/native";
import Colors from "../../constants/Colors";
import CustomText from "../CustomText";
import Fonts from "../../constants/Fonts";

const styles = StyleSheet.create({
  codeFieldRoot: { marginVertical: 10 },
  cell: {
    width: 56,
    height: 56,
    backgroundColor: Colors?.white,
    textAlign: "center",
    borderRadius: 6,
    textAlignVertical: "top",
  },
  cellText: {
    fontSize: 24,
    textAlign: "center",
    textAlignVertical: "top",
    lineHeight: 48,
  },
  focusCell: {},
  errorCell: {
    borderColor: Colors.error,
  },
  textInputStyle: {
    borderRadius: 6,
    backgroundColor: "#fe5",
  },
});

const ContainerView = styled.View<{
  top: number;
  bottom?: number;
}>`
  padding-vertical: 10px;
  width: 100%;
  margin-top: ${({ top }) => top}px;
  margin-bottom: ${({ bottom }) => bottom || 0}px;
`;

const InputBox = styled.View`
  ${{
    width: 56,
    height: 56,
    fontSize: 24,
    backgroundColor: Colors?.grey_6,
    textAlign: "center",
    borderRadius: 6,
    textAlignVertical: "top",
    lineHeight: "48px",
  }}
`;

const CELL_COUNT = 4;

type CodeInputProps = {
  name?: string;
  value?: string;
  errors?: string;
  cellCount?: number;
  bottom?: number;
  top?: number;
  handleChange?: ((e: string) => void) | undefined;
  codeFieldRootStyle?: ViewStyle;
  maskedInput?: boolean;
};

function CodeInput({
  name = "",
  value = "",
  handleChange = () => {},
  errors = "",
  cellCount = CELL_COUNT,
  codeFieldRootStyle = {},
  top = 0,
  bottom = 0,
  maskedInput = false,
}: CodeInputProps) {
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: handleChange,
  });

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: RenderCellOptions): JSX.Element => {
    let textChild = null;

    if (symbol) {
      textChild = maskedInput ? "•" : symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <InputBox
        key={index}
        style={[
          isFocused && styles.focusCell,
          errors.length > 0 && styles.errorCell,
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text style={styles.cellText}>{textChild}</Text>
      </InputBox>
    );
  };

  return (
    <ContainerView top={top} bottom={bottom}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={handleChange(name)}
        cellCount={cellCount}
        rootStyle={[styles.codeFieldRoot, codeFieldRootStyle]}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      {errors.length > 0 && (
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
      )}
    </ContainerView>
  );
}

export default CodeInput;
