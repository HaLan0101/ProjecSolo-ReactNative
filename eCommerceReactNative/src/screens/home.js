import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import { ActivityIndicator } from 'react-native';
const Home = props => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = useState(true);
    const handleNavigation = page => {
      props.navigation.navigate(page);
    };
    useEffect(() => {
      axios.get('https://fakestoreapi.com/products')
          .then((res) => {
            setProducts(res.data);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      }, []);


    return (
      <Container>
        <Title>Bienvenue sur la boutique de Yaya</Title>
        <Subtitle>Découvrir la liste des produits</Subtitle>
        <Button title="Voir mon panier" onPress={() => handleNavigation('Cart')}/>
        {loading ? (
        <ActivityIndicator size="large" color="#6b46c1" />
        ) : (
        <ProductList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
      />
      )}
      </Container>
    );
    
}
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: #6b46c1;
  margin-bottom: 32px;
`;

const ProductList = styled.FlatList`
  flex: 1;
  width: 100%;
  padding: 16px;
`;

export default Home;
