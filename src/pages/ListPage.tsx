import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import CustomText from "../components/CustomText";
import Fonts from "../constants/Fonts";
import Colors from "../constants/Colors";
import AnimatedLoader from "react-native-animated-loader";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { useIsFocused } from "@react-navigation/native";
import { FlatGrid } from "react-native-super-grid";
import TextInput from "../components/TextInput";
import { Dimensions, View } from "react-native";
import LottieAnimation from "lottie-react-native";

const { height } = Dimensions.get("window");

const Container = styled.View`
  height: 100%;
  width: 100%;
  padding-horizontal: 16px;
  padding-top: 20%;
  background-color: ${Colors.bg_black};
`;

const CardWrap = styled.View`
  height: 180px;
  background-color: ${Colors.light_grey};
  width: 100%;
  border-radius: 12px;
  padding: 7px;
  padding-bottom: 12px;
`;

const RecipeImage = styled.Image`
  height: 70%;
  width: 100%;
  border-radius: 12px;
`;

export type DigestProp = {
  label: string;
  unit: string;
  total: string;
};
export type IngredientData = {
  text: string;
  weight: Float;
  foodCategory: string;
  foodId: string;
  image: string;
};

type RecipeData = {
  recipe: {
    label: string;
    image: string;
    source: string;
    healthLabels: [string];
    ingredients: [IngredientData];
    digest: [DigestProp];
    totalTime: Float;
  };
};

interface RecipeCardProps {
  navigate: () => void;
  item: RecipeData;
}

const RecipeCard = ({ navigate, item }: RecipeCardProps): JSX.Element => {
  return (
    <CardWrap>
      <TouchableOpacity onPress={() => navigate()}>
        <RecipeImage source={{ uri: item.recipe.image }} resizeMode="cover" />

        <CustomText
          fontFamily={Fonts.PoppinsSemiBold}
          fontSize={16}
          top={6}
          color={Colors.white}
          fontWeight="700"
          numberOfLines={2}
        >
          {item.recipe.label + "\n \n"}
        </CustomText>
      </TouchableOpacity>
    </CardWrap>
  );
};

const ListPage = ({ navigation }: any): JSX.Element => {
  const [recipes, setRecipes] = useState<Array<RecipeData>>([]);
  const [searchText, setSearchText] = useState("chicken");
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  const fetchRecipes = async (): Promise<void> => {
    const url = `https://edamam-recipe-search.p.rapidapi.com/search?q=${searchText}`;
    fetch(url, {
      headers: {
        "X-RapidAPI-Key": "e9cee6b01emsha37cce87592b63ep18625djsn76f03664ad29",
        "X-RapidAPI-Host": "edamam-recipe-search.p.rapidapi.com",
        "Content-Type": "multipart/form-data",
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        setRecipes(res.hits);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.response);
      });
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchRecipes();
    }
  }, [isFocused]);

  useEffect(() => {
    setLoading(false);
    setTimeout(() => {
      fetchRecipes();
    }, 3000);
  }, [searchText]);

  return (
    <Container>
      <CustomText
        fontFamily={Fonts.PoppinsSemiBold}
        fontSize={24}
        color={Colors.white}
        fontWeight="700"
      >
        All Recipes
      </CustomText>

      <TextInput
        wrapperStyle={{ marginBottom: 10 }}
        value={searchText}
        returnValue
        handleChange={(val: string) => setSearchText(val)}
        placeholder="Search For Recipes"
      />

      {loading && (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedLoader
            visible={loading}
            overlayColor="rgba(255,255,255,0)"
            source={require("../../assets/loader.json")}
            animationStyle={{ height: 100, width: 100 }}
            speed={1}
          />
        </View>
      )}

      <FlatGrid
        data={recipes}
        showsVerticalScrollIndicator={false}
        itemDimension={150}
        keyExtractor={(item, index) => `${index} ${item?.recipe?.label}`}
        spacing={10}
        renderItem={({ item }) => (
          <RecipeCard
            item={item}
            navigate={() =>
              navigation.navigate("RecipeDetail", { data: item.recipe })
            }
          />
        )}
        style={{
          flex: 1,
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                height: height * 0.5,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieAnimation
                source={require("../../assets/empty_list.json")}
                loop={true}
                speed={1}
                autoPlay
                style={{ height: 150, width: 150 }}
              />
            </View>
          );
        }}
      />
    </Container>
  );
};

export default ListPage;
