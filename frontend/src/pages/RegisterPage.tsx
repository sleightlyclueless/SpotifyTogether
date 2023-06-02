// Register page, directly used as route
import { AppLayout } from "../layout/AppLayout.tsx";
import { Box, Button, Heading, Link, VStack } from "@chakra-ui/react";
import { AuthCard } from "../components/AuthCard.tsx";
import { Link as RouterLink } from "react-router-dom";
import { Form, Formik } from "formik";
import { InputControl } from "formik-chakra-ui";
import * as Yup from "yup";
import { RegisterSchema, useAuth } from "../provider/AuthProvider.tsx";

const registerSchema = Yup.object({
  lName: Yup.string().required("Lastname is required"),
  fName: Yup.string().required(),
  password: Yup.string().required(),
  email: Yup.string().email().required(),
});

export const RegisterPage = () => {
  const {
    actions: { register },
  } = useAuth();
  return (
    <AppLayout>
      <AuthCard>
        <Formik<RegisterSchema>
          validationSchema={registerSchema}
          initialValues={{
            email: "",
            lName: "",
            password: "",
            fName: "",
          }}
          onSubmit={register}
        >
          <VStack as={Form} alignItems="flex-start" spacing={4}>
            <Heading>Register</Heading>
            <InputControl name={"email"} label={"Email"} />
            <InputControl name={"fName"} label={"First Name"} />
            <InputControl name={"lName"} label={"Last Name"} />

            <InputControl
              name={"password"}
              label={"Password"}
              inputProps={{ type: "password" }}
            />
            <Button type={"submit"}>Register</Button>
            <Box>
              Already have an account?{" "}
              <Link as={RouterLink} to={"/auth/login"}>
                Login
              </Link>
            </Box>
          </VStack>
        </Formik>
      </AuthCard>
    </AppLayout>
  );
};
