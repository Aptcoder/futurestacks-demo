import { Flex, Box, Container, FormControl, FormLabel, Input, FormHelperText, Button, Text } from "@chakra-ui/react";

export default function CreateWithdrawalPage(){
    return (<Flex height={"100vh"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Box maxW={"100vw"} width={"lg"} borderWidth='1px' borderRadius='lg' padding={10} borderColor={"teal"} overflow={"hidden"}>
        <Container>
             <Text fontSize={"x-large"} marginBottom={10}>Create withdrawal</Text>
         </Container>
         <Container>
             <form>
                 <FormControl marginBottom={5}>
                     <FormLabel>
                     <Text fontSize={"sm"}>
                     Amount
                     </Text>
                     </FormLabel>
                     <Input type="text"/>
                     <FormHelperText>A name that describes the package is good enough</FormHelperText>
                 </FormControl>
                 
                 <Flex justifyContent={"center"}>
                 <Button
                     mt={8}
                     colorScheme='teal'
                     isLoading={false}
                     type='submit'
                     width={"lg"}
 
                 >
                     Submit
                 </Button>
                 </Flex>
             </form> 
         </Container>
         </Box>
     </Flex>)
}