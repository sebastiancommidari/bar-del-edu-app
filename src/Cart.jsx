import React from 'react';
import { Box, Text, Button, useToast, IconButton } from '@chakra-ui/react';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { CloseIcon } from '@chakra-ui/icons'; // Importar ícono de Close

function Cart({ cart, setCart, goHome }) {
  const toast = useToast();
  
  // Asegurarse de que cart sea un array vacío por defecto
  const cartItems = cart || [];
  
  // Calcular el total del carrito
  const total = cartItems.reduce((acc, product) => acc + (Number(product.price) * product.quantity), 0);

  const removeFromCart = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCart(newCart);
    toast({
      title: "Producto eliminado.",
      description: "El producto se ha eliminado del carrito.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const completePurchase = async () => {
    try {
      const purchaseData = {
        items: cartItems,
        total,
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'purchases'), purchaseData);
      setCart([]);
      toast({
        title: "Compra completada.",
        description: "Tu compra se ha realizado con éxito.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      goHome();
    } catch (error) {
      toast({
        title: "Error.",
        description: `Hubo un problema al registrar la compra: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrito limpio.",
      description: "El carrito ha sido vaciado.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      {cartItems.map((product, index) => (
        <Box key={index} p={4} borderWidth="1px" borderRadius="lg" mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Text fontWeight="bold">{product.name}</Text>
            <Text>${product.price} <strong>x {product.quantity} = ${product.price * product.quantity}</strong></Text>
          </Box>
          <IconButton colorScheme="red" icon={<CloseIcon />} onClick={() => removeFromCart(index)} /> {/* Botón de eliminar con ícono */}
        </Box>
      ))}
      <Text fontWeight="bold" fontSize="xl" mb={2} mt={4} ml={2}>Total: ${total}</Text>
      <Button mt={4} ml={2} colorScheme="red" onClick={clearCart}>Vaciar Carrito</Button>
      <Button mt={4} ml={4} colorScheme="green" onClick={completePurchase}>Cerrar Compra</Button>
      <Button mt={4} ml={2} colorScheme="gray" onClick={goHome}>Volver a Inicio</Button>
    </Box>
  );
}

export default Cart;
