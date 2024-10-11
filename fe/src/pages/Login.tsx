import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useFormik, Formik, Form as FormikForm, FormikProps } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ErrorResponseFormat } from "../utils/types";

const initialValues = {};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  const toast = useToast();
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      }}
      validationSchema={Yup.object({
        // firstName: Yup.string()
        //     .required('Required'),
        // lastName: Yup.string()
        //     .required('Required'),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters long")
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter"
          )
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
          )
          .matches(/\d/, "Password must contain at least one number")
          .matches(
            /[!@#$%^&*.]/,
            "Password must contain at least one special character"
          )
          .required("Password is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          const response = await axios.post(
            "https://paystack-side-be-0cdbe122bc32.herokuapp.com/users/login",
            {
              email: values.email,
              password: values.password,
            }
          );

          // Assuming the response contains a JWT token
          const token = response.data.data.token;

          // Store the token (you can use localStorage or any other storage method)
          sessionStorage.setItem("token", token);

          toast({
            title: "Login successful",
            description: "You have successfully logged in.",
            status: "success",
          });

          setTimeout(() => navigate("/home"), 3000);
        } catch (error) {
          const typedError = error as AxiosError<ErrorResponseFormat>;
          toast({
            title: "Login failed",
            description:
              typedError.response?.data?.message ||
              "An error occurred during login.",
            status: "error",
          });
        } finally {
          setSubmitting(false); // Stop the loading state of the button
        }
      }}
    >
      {(
        props: FormikProps<{
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        }>
      ) => (
        <FormikForm>
          <Flex
            height={"100vh"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              maxW={"100vw"}
              width={"lg"}
              borderWidth="1px"
              borderRadius="lg"
              padding={10}
              borderColor={"teal"}
              overflow={"hidden"}
            >
              <Container>
                <Text fontSize={"x-large"} marginBottom={10}>
                  Sign in
                </Text>
              </Container>
              <Container>
                {/* <form onSubmit={props.handleSubmit}> */}
                <FormControl
                  isInvalid={!!props.errors.email && props.touched.email}
                  marginBottom={5}
                >
                  <FormLabel>
                    <Text fontSize={"sm"}>Email address</Text>
                  </FormLabel>
                  <Input
                    fontSize={"sm"}
                    {...props.getFieldProps("email")}
                    type="email"
                  />
                  {props.errors.email && props.touched.email ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.email}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      We promise not to bother your mail
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={!!props.errors.password && props.touched.password}
                >
                  <FormLabel fontSize={"sm"}>Password</FormLabel>
                  <InputGroup>
                    <Input
                      fontSize={"sm"}
                      {...props.getFieldProps("password")}
                      type={showPassword ? "text" : "password"}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        colorScheme="teal"
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowPasswordClick}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {props.errors.password && props.touched.password ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.password}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      Secret stuff, shh...
                    </FormHelperText>
                  )}
                </FormControl>
                <Flex justifyContent={"center"}>
                  <Button
                    mt={8}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                    width={"lg"}
                  >
                    Submit
                  </Button>
                </Flex>
                {/* Sign Up Message */}
                <Text mt={8}>
                  Don't have an account?{" "}
                  <Link to="/register">
                    <Button variant="link" colorScheme="teal">
                      Sign up
                    </Button>
                  </Link>
                </Text>
                {/* </form>  */}
              </Container>
            </Box>
          </Flex>
        </FormikForm>
      )}
    </Formik>
  );
}
