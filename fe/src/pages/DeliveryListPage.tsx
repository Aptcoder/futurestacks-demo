import {
  Button,
  Container,
  Flex,
  FormControl,
  Switch,
  Text,
} from "@chakra-ui/react";
import Navbar from "../components/NavBar";
import { AddIcon } from "@chakra-ui/icons";
import DeliveryList, { DeliveryType } from "../components/DeliveryList";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import useUserRole from "../hooks/useRole";
import { Link, useNavigate } from "react-router-dom";

export default function DeliveryListPage() {
  const [deliveries, setDeliveries] = useState<DeliveryType[]>([]);
  const [openDeliveries, setOpenDeliveries] = useState<DeliveryType[]>([]);
  const role = useUserRole();
  const navigate = useNavigate();
  const [topMessage, setTopMessage] = useState("Your Deliveries");
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  //   const [loading, setLoading] = useState<boolean>(true);
  //   const [error, setError] = useState<string | null>(null);

  const handleSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
    let newTopMessage = isSwitchChecked ? "Your Deliveries" : "Open Deliveries";
    setTopMessage(newTopMessage);
  };

  // Fetch deliveries when the component mounts
  useEffect(() => {
    const fetchUserDeliveries = async () => {
      try {
        console.log("role is", role);
        const url =
          role === "user" ? "/deliveries/user:mine" : "/deliveries/rider:mine";
        const response = await axiosInstance.get(url);
        setDeliveries(response.data.data);
      } catch (err) {
        console.log("Failed to fetch deliveries");
      }
    };

    if (role) {
      fetchUserDeliveries();
    }
  }, [role]);

  useEffect(() => {
    const fetchOpenDeliveries = async () => {
      try {
        if (role == "user") {
          return;
        }
        console.log("role is", role);
        const url = "/deliveries/open";
        const response = await axiosInstance.get(url);
        setOpenDeliveries(response.data.data);
      } catch (err) {
        console.log("Failed to fetch open deliveries");
      }
    };

    if (role) {
      fetchOpenDeliveries();
    }
  }, [deliveries]);

  return (
    <>
      <Navbar />
      <Container mt="10px">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex
            direction={"row"}
            width="80%"
            // align={"center"}
            // justifyContent={"space-between"}
          >
            <Text fontSize="x-large" width="80%">
              {topMessage}
            </Text>
            {role === "rider" ? (
              <FormControl display="flex" alignItems="center">
                <Switch
                  isChecked={isSwitchChecked}
                  onChange={(e) => handleSwitchChange()}
                  colorScheme="teal"
                  id="open-deliveries"
                />
              </FormControl>
            ) : (
              ""
            )}
          </Flex>

          {role === "user" ? (
            <Button
              as={Link}
              to="/create-delivery"
              //   onClick={() => navigate("/create-delivery")}
              colorScheme="teal"
              rightIcon={<AddIcon />}
              size="sm"
            >
              <Text>Create</Text>
            </Button>
          ) : (
            ""
          )}
        </Flex>
      </Container>

      <DeliveryList
        isOpen={isSwitchChecked}
        role={role}
        deliveries={isSwitchChecked ? openDeliveries : deliveries}
      />
    </>
  );
}
