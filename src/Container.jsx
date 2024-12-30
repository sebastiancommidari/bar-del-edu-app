import React from 'react';
import { Box } from '@chakra-ui/react';

function Container({ children }) {
  return (
    <Box
      maxW="1200px"
      mx="auto"
      px={4}
      w="100%"
    >
      {children}
    </Box>
  );
}

export default Container;
