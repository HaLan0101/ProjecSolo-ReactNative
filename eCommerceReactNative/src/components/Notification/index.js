import React from 'react';
import styled from 'styled-components/native';

const Index = ({ message, onClose }) => {
  return (
    <Container>
      <OverlayBackground />
      <OverlayContent>
        <Message>{message}</Message>
        <CloseButton onPress={onClose}>
          <CloseButtonText>OK</CloseButtonText>
        </CloseButton>
      </OverlayContent>
    </Container>
  );
};

const Container = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const OverlayBackground = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
`;

const OverlayContent = styled.View`
  background-color: white;
  border-radius: 4px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const Message = styled.Text`
  font-size: 16px;
  text-align: center;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: #ccc;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 16px;
`;

const CloseButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

export default Index;