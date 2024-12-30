import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

function PageHeader({ title }) {
  return (
    <Box bg="teal.500" color="white" p={2} mb={2} borderRadius={4}>
      <Heading as="h1" size="lg" textAlign="center">
        {title}
      </Heading>
    </Box>
  );
}

export default PageHeader;
