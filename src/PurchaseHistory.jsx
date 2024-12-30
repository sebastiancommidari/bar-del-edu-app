import React, { useState, useEffect } from 'react';
import { Box, Text, Center, Button } from '@chakra-ui/react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { DateTime } from 'luxon';

function PurchaseHistory({ goHome }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      const q = query(collection(db, 'purchases'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const purchasesList = querySnapshot.docs.map((doc, index) => ({
        id: doc.id,
        number: index + 1,
        ...doc.data()
      }));
      setPurchases(purchasesList);
      setLoading(false);
    };

    fetchPurchases();
  }, []);

  return (
    <Box pb={6}>
      <Button mb={3} mt={1} colorScheme="gray" onClick={goHome} width="100%">Volver a Inicio</Button>
      {loading ? (
        <Center>
          <Text>Cargando historial de compras...</Text>
        </Center>
      ) : (
        purchases.map((purchase, index) => (
          <Box key={purchase.id} p={4} borderWidth="1px" borderRadius="lg" mb={2}>
            <Text fontWeight="bold">
              # {DateTime.fromISO(purchase.timestamp).setZone('America/Argentina/Buenos_Aires').toFormat('dd/LL/yyyy HH:mm:ss')} Hs.
            </Text>
            <Text><strong>Total: ${purchase.total}</strong></Text>
            {purchase.items.map((item, itemIndex) => (
              <Text key={itemIndex}>{item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}</Text>
            ))}
          </Box>
        ))
      )}
    </Box>
  );
}

export default PurchaseHistory;
