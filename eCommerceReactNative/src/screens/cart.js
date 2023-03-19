import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button/index';
import styled from 'styled-components/native';
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import Notification from '../components/Notification/index';
const Cart = () => {
  const stripe = useStripe();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  useEffect(() => {
      AsyncStorage.getItem('cart')
      .then((cart) => {
          if (cart !== null) {
              setCart(JSON.parse(cart));
          }
      })
      .catch(err => {
          console.log(err);
      })
  },[]);

  useEffect(() => {
    const newTotalPrice = cart.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [cart]);

  const removeCart = ( )=> {
    AsyncStorage.removeItem('cart')
    setCart([]);
    setNotificationMessage('Le panier a été vidé.');
    setShowNotification(true);
  }
  const removeProduct = async (product) => {
    try {
      const newCart = cart.filter((cartItem) => cartItem.id !== product.id);
      setCart(newCart);
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      setNotificationMessage('Le produit a été supprimé.');
      setShowNotification(true);
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = (product) => {
    const newCart = cart.map((cartItem) => {
      if (cartItem.id === product.id) {
        cartItem.quantity += 1;
      }
      return cartItem;
    });
    updateQuality(newCart);
  };

  const decreaseQuantity = (product) => {
    const newCart = cart.map((cartItem) => {
      if (cartItem.id === product.id) {
        cartItem.quantity -= 1;
      }
      return cartItem;
    })
    .filter((cartItem) => cartItem.quantity > 0);
    updateQuality(newCart);
  };

  const updateQuality = (newCart)=> {
    setCart(newCart);
    AsyncStorage.setItem('cart', JSON.stringify(newCart))
      .catch((error) => 
        console.log(error)
      );
  }
  const payment = async () => { 
  try {
    const response = await axios.post('http://192.168.1.92:8080/pay', { totalPrice }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    if (!response.status === 200){ 
      setNotificationMessage(data.message);
      return setShowNotification(true);
    }
    const clientSecret = data.clientSecret;
    const initSheet = await stripe.initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      googlePay: true,
      merchantDisplayName: 'Yaya',
    });
    if (initSheet.error){
      setNotificationMessage(initSheet.error.message);
      return setShowNotification(true);
    }
    const presentSheet = await stripe.presentPaymentSheet({
      clientSecret
    });
    if (presentSheet.error){
      setNotificationMessage(presentSheet.error.message);
      return setShowNotification(true);
    }
    setNotificationMessage("Paiement est réussi, merci!");
    setShowNotification(true);
  } catch (err) {
    console.error(err);
    if (err.response) {
      Alert.alert(err.response.data.message);
    } else if (err.request) {
      setNotificationMessage("Erreur réseau");
      setShowNotification(true);
    } else {
      setNotificationMessage("Une erreur est survenue");
      setShowNotification(true);
    }
  }
};

  return (
    <Container>
      <StripeProvider publishableKey="pk_test_51K1CcuEeZpf2oSjtY31J3p45Bw13XLxtS4fA7L2onJeE0lwpfnsHnaxSkvOjiVDy0OhCOwRoEsvTdrsA3kKpoS8X00g2bO90pj">
      <Title>Votre panier</Title>
        <Button title="Vider le panier" onPress={() => removeCart()}/>
          <FlatList
            data={cart}
            ListEmptyComponent={() => <EmptyCartText>Votre panier est vide</EmptyCartText>}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItem>
                <ItemImage source={{ uri: item.image }} />
                <ItemDetails>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemPrice>{item.price}</ItemPrice>
                  <ItemQuantity>
                    <Button title="-" onPress={() => decreaseQuantity(item)} />
                    <QuantityText>{item.quantity}</QuantityText>
                    <Button title="+" onPress={() => increaseQuantity(item)} />
                  </ItemQuantity>
                </ItemDetails>
                <Button title="Supprimer ce produit" onPress={() => removeProduct(item)}/>
              </CartItem>
            )}
          />
          <TotalPrice>Prix total : {totalPrice} €</TotalPrice>
          <Button title="Payer" onPress={() => payment()}/>
          {showNotification && <Notification message={notificationMessage} onClose={()=>setShowNotification(!showNotification)}/>}
      </StripeProvider>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f7f7f7;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const EmptyCartText = styled.Text`
  font-size: 18px;
  text-align: center;
`;

const CartItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const ItemImage = styled.Image`
  width: 80px;
  height: 80px;
  margin-right: 16px;
`;

const ItemDetails = styled.View`
  flex: 1;
`;

const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const ItemPrice = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #6b46c1;
  margin-bottom: 8px;
`;

const QuantityText = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const ItemQuantity = styled.Text`
  font-size: 14px;
  display: flex;
`;

const TotalPrice = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-top: 16px;
`;

export default Cart;