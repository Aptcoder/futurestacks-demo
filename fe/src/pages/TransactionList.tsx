import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  StackDivider,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import TransactionCard, {
  transactionType,
} from "../components/TransactionCard";
import { useLocation } from "react-router-dom";
import { InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import AcceptDeliveryForm from "../components/AcceptDeliveryForm";
import WithdrawForm from "../components/WithdrawForm";
import CreateWithdrawalAccountForm from "../components/CreateWithdrawalAccountForm";
import FundAccountForm from "../components/FundAccountForm";
import { formatAmount } from "../utils";

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
  role: string;
  balance: number;
  recipientCode: string;
  subaccountCode: string;
  withdrawalAccount?: {
    bankCode: string;
    accountName: string;
    bankName: string;
    accountNumber: string;
    _id: string;
  };
};

export default function TransactionList() {
  const [user, setUser] = useState<UserType>();
  const [transactions, setTransactions] = useState<transactionType[]>();
  const [isNewTransaction, setIsNewTransaction] = useState(false);
  const location = useLocation();
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const [innerComponentName, setInnerComponetName] = useState("withdraw");

  const handleModalOpen = (inner: string) => {
    setInnerComponetName(inner);
    onOpen();
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const reference = queryParams.get("reference");
        if (!reference) {
          return;
        }
        const response = await axiosInstance.get(
          `/deliveries/verify?reference=${reference}`
        );
        setIsNewTransaction(true);
        // window.location.reload();
      } catch (error) {
        console.log("Payment verification failed", error);
      }
    };

    verifyPayment();
  }, []);

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      try {
        let response = await axiosInstance.get("/users/me");
        setUser(response.data.data);

        response = await axiosInstance.get("/transactions/mine");
        setTransactions(response.data.data);
      } catch (err) {
        console.log("Failed to load user and transactions");
      }
    };
    if (!user || !transactions) {
      fetchUserAndTransactions();
    }
  }, [isNewTransaction]);
  return (
    <>
      <Navbar />
      {user && transactions ? (
        <Flex mt="25px" width="80vw" mx="auto" gap="5%">
          <Flex direction={"column"} gap={"3vh"}>
            <Card width={"100%"} alignSelf="flex-start" variant={"outline"}>
              <CardBody>
                <Stat>
                  <StatLabel fontSize="md">Wallet Balance</StatLabel>
                  <StatNumber>
                    {"\u{20A6}"}
                    {formatAmount(user.balance)}
                  </StatNumber>
                  {/* <StatHelpText>Feb 12 - Feb 28</StatHelpText> */}
                </Stat>
              </CardBody>
            </Card>
            <Button colorScheme="teal" onClick={() => handleModalOpen("fund")}>
              Fund Wallet
            </Button>
            {user.withdrawalAccount ? (
              <Card alignSelf="flex-start" variant={"outline"}>
                <CardBody>
                  <Stack divider={<StackDivider />}>
                    <Box>
                      <Tooltip label="Withdrawals and settlements are sent here">
                        <InfoOutlineIcon boxSize={"0.9em"} />
                      </Tooltip>{" "}
                      <Text fontSize={"md"} fontWeight={"normal"}>
                        Withdrawal account
                      </Text>
                    </Box>

                    <Box fontSize={"md"}>
                      <Text>{user.withdrawalAccount.accountNumber}</Text>
                      <Text>{user.withdrawalAccount.bankName}</Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            ) : (
              ""
            )}

            {user.withdrawalAccount ? (
              <>
                <Button
                  colorScheme="teal"
                  onClick={() => handleModalOpen("withdraw")}
                >
                  Withdraw
                </Button>
              </>
            ) : (
              <Button
                colorScheme="teal"
                onClick={() => handleModalOpen("create")}
              >
                Add Account
              </Button>
            )}
          </Flex>

          <Flex flexDirection="column" width="80%">
            <Box>
              <Text fontSize={"lg"}>Transactions</Text>
            </Box>

            {transactions.map((t) => {
              return (
                <TransactionCard key={t._id} transaction={t}></TransactionCard>
              );
            })}
          </Flex>
        </Flex>
      ) : (
        ""
      )}

      <Modal size={"lg"} isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {innerComponentName === "create" ? (
              <CreateWithdrawalAccountForm onClose={onClose} />
            ) : innerComponentName === "fund" ? (
              <FundAccountForm onClose={onClose} />
            ) : (
              <WithdrawForm onClose={onClose} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
