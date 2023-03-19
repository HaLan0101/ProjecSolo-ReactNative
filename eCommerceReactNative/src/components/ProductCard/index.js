import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from "../Button/index";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Details from '../../screens/details';
import Notification from '../Notification/index';
const Index = ({product}) => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigation = useNavigation();
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
            setNotificationMessage('Le produit a été ajouté au panier.');
            setShowNotification(true);
        } else {
          items[index].quantity += quantity;
          setNotificationMessage('Le produit a déjà été ajouté au panier.');
          setShowNotification(true);
        }

        await AsyncStorage.setItem('cart', JSON.stringify(items));
      }catch (err) {
          console.error(err);
        }
    };
    const productDetails = () => {
      navigation.navigate('Details', { productId: product.id });
    };
    
    return (
        <Container key={product.id}>
            <ImageTouchable onPress={() => productDetails()}>
              <ProductImage source={{ uri: product.image }} />
            </ImageTouchable>
            <ProductDetails>
                <ProductName>{product.title}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
                <ProductDescription>{product.category}</ProductDescription>
                <Button title="Ajouter au panier" onPress={() => handleAddToCart(product)}/>
            </ProductDetails>
            {showNotification && <Notification message={notificationMessage} onClose={()=>setShowNotification(!showNotification)}/>}
        </Container>
    );
}


const Container = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  border: solid black;
`;

const ProductImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 16px;
  margin-right: 24px;
`;

const ImageTouchable = styled.TouchableOpacity`
`;

const ProductDetails = styled.View`
  flex: 1;
`;

const ProductName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ProductPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #6b46c1;
  margin-bottom: 16px;
`;

const ProductDescription = styled.Text`
  font-size: 14px;
  margin-bottom: 16px;
`;

export default Index;