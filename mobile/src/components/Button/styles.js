import styled from 'styled-components';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
  height: 46px;
  background: #3B9EFF;
  border-radius: 4px;
  
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text`
  color: #FFF;
  font-weight: bold;
  font-size: 16px;
`;