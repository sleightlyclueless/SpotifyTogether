import { AppLayout } from "../layout/AppLayout.tsx";
import { Box, Button, Heading, Link, VStack } from "@chakra-ui/react";
import { AuthCard } from "../components/AuthCard.tsx";
import { Link as RouterLink } from "react-router-dom";
import { Form, Formik } from "formik";
import { InputControl } from "formik-chakra-ui";
import * as Yup from "yup";
import { RegisterData } from "../provider/AuthProvider.tsx";

const registerSchema = Yup.object({
  nachname: Yup.string().required("Nachname ist erforderlich"),
  vorname: Yup.string().required(),
  password: Yup.string().required(),
  email: Yup.string().email().required(),
});

export const RegisterPage = () => {
  return (
    <AppLayout>
      <AuthCard>
        <Formik<RegisterData>
          validationSchema={registerSchema}
          initialValues={{
            email: "",
            nachname: "",
            password: "",
            vorname: "",
          }}
          onSubmit={console.log}
        >
          <VStack as={Form} alignItems="flex-start" spacing={4}>
            <Heading>Registrieren</Heading>
            <InputControl name={"email"} label={"Email"} />
            <InputControl name={"vorname"} label={"Vorname"} />
            <InputControl name={"nachname"} label={"Nachname"} />

            <InputControl
              name={"password"}
              label={"Password"}
              inputProps={{ type: "password" }}
            />
            <Button type={"submit"}>Registrieren</Button>
            <Box>
              Bereits ein Konto?{" "}
              <Link as={RouterLink} to={"/auth/login"}>
                Anmelden
              </Link>
            </Box>
          </VStack>
        </Formik>
      </AuthCard>
    </AppLayout>
  );
};
