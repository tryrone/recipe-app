import React from "react";
import styled from "styled-components/native";
import Colors from "../constants/Colors";
import CustomText from "../components/CustomText";
import Fonts from "../constants/Fonts";
import {
  Avocado,
  Cancel,
  Clock,
  Fire,
  Heart,
  Pizza,
  Wheat,
} from "../../assets/svg";
import { ScrollView, View } from "react-native";
import { DigestProp, IngredientData } from "./ListPage";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

const Container = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${Colors.bg_black};
`;

const FoodImage = styled.ImageBackground`
  height: 100%;
  width: 100%;
`;

const ModalBodyWrap = styled.View`
  background-color: ${Colors.light_grey};
  height: 66%;
  width: 100%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  padding-horizontal: 16px;
  margin-top: -35px;
`;

const SpacedRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ItemCont = styled.View`
  height: 45px;
  width: 45px;
  border-radius: 10px;
  background-color: ${Colors.black_2};
  justify-content: center;
  align-items: center;
`;

const IngridientImage = styled.Image`
  height: 45px;
  width: 45px;
  border-radius: 10px;
  background-color: ${Colors.black_2};
  justify-content: center;
  align-items: center;
`;

const Wrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const NavItemWrap = styled.TouchableOpacity`
  height: 40px;
  width: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.white};
`;

const NavigationWrap = styled.View`
  width: 100%;
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 12px;
  top: 15%;
`;

interface NutrientWrapProps {
  icon: JSX.Element;
  text: string;
}
interface IngredientContProps {
  image: string;
  text: string;
}

const NutrientWrap = ({ icon, text }: NutrientWrapProps): JSX.Element => {
  return (
    <Row style={{ width: "48%", marginBottom: 30 }}>
      <ItemCont>{icon}</ItemCont>
      <CustomText
        fontFamily={Fonts.PoppinsMedium}
        fontSize={16}
        left={6}
        numberOfLines={2}
        style={{ flex: 1 }}
        color={Colors.white}
        fontWeight="700"
      >
        {text}
      </CustomText>
    </Row>
  );
};

const IngredientCont = ({ image, text }: IngredientContProps): JSX.Element => {
  return (
    <Row style={{ marginBottom: 30 }}>
      <IngridientImage source={{ uri: image }} resizeMode="cover" />
      <CustomText
        fontFamily={Fonts.PoppinsMedium}
        fontSize={16}
        left={6}
        numberOfLines={2}
        style={{ flex: 1 }}
        color={Colors.white}
        fontWeight="700"
      >
        {text}
      </CustomText>
    </Row>
  );
};

const NavigationContainer = ({ navigation }): JSX.Element => {
  return (
    <NavigationWrap>
      <NavItemWrap onPress={() => navigation?.goBack()}>
        <Cancel />
      </NavItemWrap>
      <NavItemWrap>
        <Heart />
      </NavItemWrap>
    </NavigationWrap>
  );
};

type RecipeData = {
  label: string;
  image: string;
  source: string;
  healthLabels: [string];
  ingredients: [IngredientData];
  digest: [DigestProp];
  totalTime: Float;
};

const RecipeDetail = ({ navigation, route }) => {
  const recipeData: RecipeData = route.params.data;

  const getNutrientTextByIndexNumber = (index: number): string => {
    return `${parseFloat(recipeData?.digest[index]?.total).toFixed(0)} ${
      recipeData?.digest[index]?.unit
    } ${recipeData?.digest[index]?.label}`;
  };

  return (
    <Container>
      <View style={{ width: "100%", height: "40%" }}>
        <FoodImage source={{ uri: recipeData.image }} resizeMode="cover">
          <NavigationContainer navigation={navigation} />
        </FoodImage>
      </View>
      <ModalBodyWrap>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SpacedRow style={{ marginTop: "14%" }}>
            <CustomText
              fontFamily={Fonts.PoppinsBold}
              fontSize={24}
              color={Colors.white}
              style={{ flex: 1 }}
              fontWeight="800"
              bottom={15}
            >
              {recipeData.label}
            </CustomText>

            <Row style={{ position: "relative", right: 10 }}>
              <Clock style={{ position: "relative", top: -23 }} />
              <CustomText
                fontFamily={Fonts.PoppinsRegular}
                fontSize={14}
                left={5}
                color={Colors.white}
                bottom={15}
              >
                {recipeData.totalTime} Min
              </CustomText>
            </Row>
          </SpacedRow>

          <Wrap>
            <NutrientWrap
              icon={<Wheat />}
              text={getNutrientTextByIndexNumber(1)}
            />
            <NutrientWrap
              icon={<Avocado />}
              text={getNutrientTextByIndexNumber(2)}
            />
            <NutrientWrap
              icon={<Fire />}
              text={getNutrientTextByIndexNumber(3)}
            />
            <NutrientWrap
              icon={<Pizza />}
              text={getNutrientTextByIndexNumber(4)}
            />
          </Wrap>

          <CustomText
            fontFamily={Fonts.PoppinsBold}
            fontSize={20}
            color={Colors.white}
            fontWeight="800"
            top={10}
          >
            Ingredients
          </CustomText>
          <CustomText
            fontFamily={Fonts.PoppinsMedium}
            fontSize={14}
            color={Colors.white}
            fontWeight="800"
            top={10}
          >
            {recipeData?.ingredients?.length} Item
            {recipeData?.ingredients?.length > 1 ||
            recipeData?.ingredients?.length < 1
              ? "s"
              : ""}
          </CustomText>

          <View style={{ marginBottom: "10%", marginTop: 33 }}>
            {recipeData.ingredients.map((item) => {
              return (
                <IngredientCont
                  key={item?.foodId}
                  image={item?.image}
                  text={item?.text}
                />
              );
            })}
          </View>
        </ScrollView>
      </ModalBodyWrap>
    </Container>
  );
};

export default RecipeDetail;
