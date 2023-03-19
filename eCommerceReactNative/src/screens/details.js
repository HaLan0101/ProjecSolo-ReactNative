import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button/index';
import styled from 'styled-components/native';
import { ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Details = ({route}) => {
    const {productId} = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const handleAddToCart = async (product) => {
      try {
        const cartItems = await AsyncStorage.getItem('cart');
        let items = [];
  
        if (cartItems !== null) {
          items = JSON.parse(cartItems);
        }
        const index = items.findIndex((item) => item.id === product.id);
        if (index == -1) {
            product.quantity = 1;
            items.push({ ...product, quantity });
            console.log(items);
            alert("Ce produit a été bien crée dans votre panier");
        } else {
          items[index].quantity += quantity;
          console.log(items);
          alert("Ce produit a été déjà ajouté dans votre panier");
        }

        await AsyncStorage.setItem('cart', JSON.stringify(items));
      }catch (err) {
          console.error(err);
        }
    };
    useEffect(() => {
     
        axios.get(`https://fakestoreapi.com/products/${productId}`)
            .then((res) => {
              setProduct(res.data);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            });
        }, []);
    return (
        <>
            {loading ? (
            <ActivityIndicator size="large" color="#6b46c1" />
            ) : (
                <ScrollView>
                    <Container key={product.id}>
                        <ProductImage source={{ uri: product.image }} />
                        <ProductDetails>
                            <ProductName>{product.title}</ProductName>
                            <ProductPrice>{product.price}</ProductPrice>
                            <ProductDescription>{product.description}</ProductDescription>
                            <Button title="Ajouter au panier" onPress={() => handleAddToCart(product)}/>
                        </ProductDetails>
                    </Container>
                </ScrollView>
            )}
        </>
    );
}
const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
`;

const ProductDetails = styled.View`
  flex: 1;
`;

const ProductName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProductPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProductDescription = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
`;

export default Details;
