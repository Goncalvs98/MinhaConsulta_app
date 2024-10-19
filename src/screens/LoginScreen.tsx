import React, { useState } from 'react';
import { NativeBaseProvider, Box, Button, Input, Center } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { Alert as RNAlert } from 'react-native';
import { login } from '../api/auth'; // Função de login que envia os dados para o backend
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenar o token de forma segura

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Estado para mostrar carregamento

  const handleLogin = async () => {
    if (!username || !password) {
      RNAlert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); // Inicia o estado de carregamento

    try {
      const token = await login(username, password);
      console.log('Token:', token);

      // Armazenar o token JWT no AsyncStorage
      await AsyncStorage.setItem('token', token);

      RNAlert.alert('Login realizado com sucesso!');
      navigation.navigate('ConsultationsList'); // Redirecionar para a tela de consultas
    } catch (err: unknown) {
      // Verificar se err é uma instância de Error
      if (err instanceof Error) {
        RNAlert.alert('Erro', err.message);
      } else {
        RNAlert.alert('Erro', 'Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} bg="white">
        <Box>
          <Input
            placeholder="Usuário"
            mb={4}
            value={username}
            onChangeText={setUsername}
          />
          <Input
            placeholder="Senha"
            mb={4}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button isLoading={loading} onPress={handleLogin}>
            Entrar
          </Button>
          <Button onPress={() => navigation.navigate('SignUp')} mt={4}>
            Cadastrar
          </Button>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default LoginScreen;
