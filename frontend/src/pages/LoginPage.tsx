// Login page, directly used as route
import { AppLayout } from "../layout/AppLayout.tsx";
import { Box, Button, Heading, Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AuthCard } from "../components/AuthCard.tsx";
import { Form, Formik } from "formik";
import { InputControl } from "formik-chakra-ui";
import * as Yup from "yup";
import { LoginSchema, useAuth } from "../provider/AuthProvider.tsx";

const loginSchema = Yup.object({
  password: Yup.string().required(),
  email: Yup.string().email().required(),
});

export const LoginPage = () => {
  const {
    actions: { login },
  } = useAuth();
  return (
    <AppLayout>
      <AuthCard>
        <Heading>Login</Heading>
        <Formik<LoginSchema>
          validationSchema={loginSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={login}
        >
          <VStack as={Form} alignItems="flex-start" spacing={4}>
            <InputControl name="email" label={"E-Mail"} />
            <InputControl
              label={"Password"}
              inputProps={{
                type: "password",
              }}
              name="password"
            />
            <Button type={"submit"}>Login</Button>
            <Box>
              New here?{" "}
              <Link as={RouterLink} to={"/auth/register"}>
                Register Account
              </Link>
            </Box>
          </VStack>
        </Formik>
      </AuthCard>
    </AppLayout>
  );
};
