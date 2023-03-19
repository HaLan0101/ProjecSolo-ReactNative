import React from 'react';
import styled from 'styled-components';
const Index = ({ title, onPress}) => {
    return (
        <StyledButton onPress={onPress}>
            <StyledText>{title}</StyledText>
        </StyledButton>
    );
}
const StyledButton = styled.TouchableOpacity`
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.Text`
  color: white;
  font-weight: bold;
`;

export default Index;
