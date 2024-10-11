import {
  Box,
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { Form, Formik, Form as FormikForm, FormikProps } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ErrorResponseFormat } from "../utils/types";

export default function Register() {
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
        role: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
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
            "https://paystack-side-be-0cdbe122bc32.herokuapp.com/users/",
            {
              email: values.email,
              password: values.password,
              firstName: values.firstName,
              lastName: values.lastName,
              role: values.role,
            }
          );

          toast({
            title: "Sign up successful",
            description: "You have successfully created an account.",
            status: "success",
          });

          setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
          const typedError = error as AxiosError<ErrorResponseFormat>;
          toast({
            title: "Sign up failed",
            description:
              typedError.response?.data?.message ||
              "An error occurred during login.",
            status: "error",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(
        props: FormikProps<{
          firstName: string;
          lastName: string;
          email: string;
          password: string;
          role: string;
        }>
      ) => (
        <Form onSubmit={props.handleSubmit}>
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
                  Sign up
                </Text>
              </Container>
              <Container>
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
                  marginBottom={5}
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
                <FormControl
                  isInvalid={
                    !!props.errors.firstName && props.touched.firstName
                  }
                  marginBottom={5}
                >
                  <FormLabel>
                    <Text fontSize={"sm"}>First name</Text>
                  </FormLabel>
                  <Input
                    fontSize={"sm"}
                    {...props.getFieldProps("firstName")}
                    type="text"
                  />
                  {props.errors.firstName && props.touched.firstName ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.firstName}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      Preferably what you'll like to be called
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={!!props.errors.lastName && props.touched.lastName}
                  marginBottom={5}
                >
                  <FormLabel>
                    <Text fontSize={"sm"}>Last name</Text>
                  </FormLabel>
                  <Input
                    fontSize={"sm"}
                    {...props.getFieldProps("lastName")}
                    type="text"
                  />
                  {props.errors.lastName && props.touched.lastName ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.lastName}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      Enter your last name
                    </FormHelperText>
                  )}
                </FormControl>
                <RadioGroup
                  value={props.values.role}
                  onChange={(value) => props.setFieldValue("role", value)}
                  colorScheme="teal"
                  defaultValue={"user"}
                  mt={8}
                >
                  <Stack spacing={[1, 5]} direction={"row"}>
                    <Radio value="user">Customer</Radio>
                    <Radio value="rider">Rider</Radio>
                  </Stack>
                </RadioGroup>
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
                  Already have an account?{" "}
                  <Link to="/login">
                    <Button variant="link" colorScheme="teal">
                      Sign in
                    </Button>
                  </Link>
                </Text>
              </Container>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  );
}
