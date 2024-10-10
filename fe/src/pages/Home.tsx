import { Container, Text, Flex, HStack, Button, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/NavBar";
import { QuestionIcon } from "@chakra-ui/icons";
import useUserRole from "../hooks/useRole";

export default function Home() {
  const role = useUserRole();
  if (!role) {
    return null;
  }
  return (
    <>
      <Navbar></Navbar>
      <Container>
        <Flex
          flexDirection="column"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <Box display="inline" fontSize="8xl" mb={"20px"}>
            {"\u{1F914}"}
          </Box>
          <Text textAlign="center" fontSize="large" my="10px">
            What would you like to do today?
          </Text>
          <HStack spacing={4}>
            {role === "user" ? (
              <Button
                as={RouterLink}
                to="/create-delivery"
                colorScheme="teal"
                size="md"
              >
                Create a delivery
              </Button>
            ) : (
              ""
            )}

            <Button
              as={RouterLink}
              to="/deliveries"
              variant="outline"
              colorScheme="teal"
              size="md"
            >
              See your deliveries
            </Button>
          </HStack>
        </Flex>
      </Container>
    </>
  );
}
