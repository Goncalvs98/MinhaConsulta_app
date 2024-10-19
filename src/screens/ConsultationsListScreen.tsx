import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

interface Consultation {
  id: number;
  date: string;
  doctor: string;
  specialty: string;
  status: string;
  username: string;
}

const ConsultationsListScreen = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Para exibir um loading enquanto busca os dados

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        // Recuperar o token JWT do AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (token) {
          // axios.get('http://localhost:3000/api/consultations')
          // .then((response) => {
          //   setConsultations(response.data);
          // })
          // Fazer a requisição ao backend com o token no cabeçalho
          const response = await axios.get('http://localhost:3000/api/consultations', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Teste");
          console.log(response);
          

          setConsultations(response.data); // Definir os dados das consultas
        } else {
          console.error('Token não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar consultas:', error);
      } finally {
        setLoading(false); // Remover o estado de loading após a requisição
      }
    };

    fetchConsultations();
  }, []);

  const renderItem = ({ item }: { item: Consultation }) => (
    <View style={styles.consultationItem}>
      <Text>Paciente: {item.username}</Text>
      <Text>Data: {item.date}</Text>
      <Text>Médico: {item.doctor}</Text>
      <Text>Especialidade: {item.specialty}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={consultations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  consultationItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConsultationsListScreen;
