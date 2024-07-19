import React, { useState } from "react";
import { Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

import { ThemedScrollView, ThemedView } from "@/components/ThemedView";
import { ThemedText, ThemedTextInput } from "@/components/ThemedText";

interface Product {
  name: string;
  photo: string[];
  price: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const [currentProduct, setCurrentProduct] = useState<Product>({
    name: "",
    photo: [],
    price: "",
  });

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Maximum Products Reached",
        body: "You have added 5 products, which is the maximum limit.",
      },
      trigger: null,
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCurrentProduct({ ...currentProduct, photo: [result.assets[0].uri] });
    }
  };

  const addProduct = () => {
    if (products.length >= 5) {
      Alert.alert(
        "Maximum limit reached",
        "You can only add up to 5 products."
      );
      return;
    }

    if (
      !currentProduct.name ||
      !currentProduct.photo ||
      !currentProduct.price
    ) {
      Alert.alert("Incomplete information", "Please fill in all fields.");
      return;
    }

    setProducts([...products, currentProduct]);
    setCurrentProduct({ name: "", photo: [], price: "" });

    if (products.length === 4) {
      scheduleNotification();
    }
  };

  return (
    <ThemedScrollView style={{ padding: 20 }}>
      <ThemedText type="title">Product Upload App</ThemedText>

      <ThemedView style={{ marginBottom: 20 }}>
        <ThemedTextInput
          placeholder="Product Name"
          value={currentProduct.name}
          onChangeText={(text) =>
            setCurrentProduct({ ...currentProduct, name: text })
          }
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
          }}
        />
        <ThemedTextInput
          placeholder="Price"
          value={currentProduct.price}
          onChangeText={(text) =>
            setCurrentProduct({ ...currentProduct, price: text })
          }
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button title="Select Photo" onPress={pickImage} />
        {currentProduct.photo.length > 0 &&
          currentProduct.photo.map((photo, i) => (
            <Image
              key={i}
              source={{ uri: photo }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          ))}
        <Button title="Add Product" onPress={addProduct} />
      </ThemedView>

      {/* Product list */}
      <ThemedView>
        <ThemedText
          style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
        >
          Products ({products.length}/5):
        </ThemedText>
        {products.map((product, index) => (
          <ThemedView
            key={index}
            style={{ flexDirection: "row", marginBottom: 10 }}
          >
            <Image
              source={{ uri: product.photo[0] }}
              style={{ width: 50, height: 50, marginRight: 10 }}
            />
            <ThemedView>
              <ThemedText>{product.name}</ThemedText>
              <ThemedText>${product.price}</ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedScrollView>
  );
}
