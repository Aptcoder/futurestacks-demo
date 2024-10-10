import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { useState, useEffect, FormEvent } from "react";
import { Formik, Form as FormikForm, FormikProps } from "formik";
import * as Yup from "yup";
import axiosInstance from "../utils/axios";
import Select from "react-select";
import { ErrorResponseFormat } from "../utils/types";

interface Bank {
  name: string;
  code: string;
}

export default function CreateWithdrawalAccountForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const toast = useToast();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);

  const verifyAccount = async (bankCode: string, accountNumber: string) => {
    try {
      console.log("verifying bank account", bankCode, accountNumber);
      if (!bankCode || !accountNumber || accountNumber.length < 10) {
        return;
      }
      setIsVerifyingAccount(true);
      console.log("bank", bankCode);
      const response = await axiosInstance.get(
        `/transactions/banks/resolve_account?bankCode=${bankCode}&accountNumber=${accountNumber}`
      );

      console.log("verified bank", response.data);
      toast({
        description: "Account verified. Confirm details",
        status: "success",
      });
      setUserName(response.data.data.accountName);
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Could not verify account number.",
        status: "error",
      });
      setUserName(null);
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  const handleFormSubmit = (
    e: FormEvent,
    propsSubmit: CallableFunction,
    bankCode: string,
    accountNumber: string
  ) => {
    e.preventDefault();
    if (userName) {
      return propsSubmit(e);
    } else {
      return verifyAccount(bankCode, accountNumber);
    }
  };

  useEffect(() => {
    // Fetch banks from API
    const fetchBanks = async () => {
      try {
        const response = await axiosInstance.get("/transactions/banks");
        setBanks(response.data.data); // Assuming response.data is an array of bank objects
        setIsLoadingBanks(false);
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast({
          title: "Error fetching banks",
          description: "Unable to load the list of banks.",
          status: "error",
        });
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  return (
    <Formik
      initialValues={{
        bankCode: "",
        accountNumber: "",
        accountName: "",
      }}
      validationSchema={Yup.object({
        bankCode: Yup.string().required("Bank is required"),
        accountNumber: Yup.string()
          .matches(/^[0-9]{10}$/, "Account number must be 10 digits")
          .required("Account number is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          console.log("submitted values", values);
          setSubmitting(true);

          const response = await axiosInstance.post(
            `/users/me/withdrawal_account`,
            {
              bankCode: values.bankCode,
              accountNumber: values.accountNumber,
              accountName: userName,
            }
          );

          toast({
            title: "Bank account added",
            description: "Your withdrawal account has been added successfully.",
            status: "success",
          });
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2500);
        } catch (error) {
          const typedError = error as AxiosError<ErrorResponseFormat>;
          toast({
            title: "Adding bank account failed",
            description:
              typedError.response?.data?.message ||
              "An error occurred while adding your bank account.",
            status: "error",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(
        props: FormikProps<{
          bankCode: string;
          accountNumber: string;
          accountName: string;
        }>
      ) => {
        return (
          <FormikForm
            onSubmit={(e) =>
              handleFormSubmit(
                e,
                props.handleSubmit,
                props.values.bankCode,
                props.values.accountNumber
              )
            }
          >
            <Flex
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Container>
                <Text fontSize={"x-large"} marginBottom={10}>
                  Create Withdrawal Account
                </Text>

                {/* Bank Select with Searchable Dropdown */}
                <FormControl
                  isInvalid={!!props.errors.bankCode && props.touched.bankCode}
                >
                  <FormLabel fontSize={"sm"}>Bank</FormLabel>
                  <Select
                    options={banks.map((bank) => ({
                      label: bank.name,
                      value: bank.code,
                    }))}
                    isLoading={isLoadingBanks}
                    onChange={(option) => {
                      props.setFieldValue("bankCode", option?.value);
                    }}
                    placeholder="Select or search a bank"
                  />
                  {props.errors.bankCode && props.touched.bankCode ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.bankCode}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      Select your preferred bank.
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={
                    !!props.errors.accountNumber && props.touched.accountNumber
                  }
                  mt={4}
                >
                  <FormLabel fontSize={"sm"}>Account Number</FormLabel>
                  <Input
                    fontSize={"small"}
                    {...props.getFieldProps("accountNumber")}
                    type="text"
                    maxLength={10}
                  />
                  {props.errors.accountNumber && props.touched.accountNumber ? (
                    <FormErrorMessage fontSize={"x-small"}>
                      {props.errors.accountNumber}
                    </FormErrorMessage>
                  ) : userName ? (
                    <FormHelperText fontSize={"x-small"}>
                      {`Account name: ${userName}`}
                    </FormHelperText>
                  ) : (
                    <FormHelperText fontSize={"x-small"}>
                      Enter your 10-digit account number.
                    </FormHelperText>
                  )}
                </FormControl>

                <Flex justifyContent={"center"}>
                  <Button
                    mt={8}
                    mb={5}
                    colorScheme="teal"
                    isLoading={props.isSubmitting || isVerifyingAccount}
                    // onClick={() => props.handleSubmit}
                    type="submit"
                    width={"lg"}
                  >
                    {userName ? "Submit" : "Verify"}
                  </Button>
                </Flex>
              </Container>
            </Flex>
          </FormikForm>
        );
      }}
    </Formik>
  );
}
