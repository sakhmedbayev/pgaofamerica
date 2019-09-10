import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { CustomTextField } from "./CustomTextField";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function AddPlayer({
  createNewPlayer,
  updateAPlayer,
  userToEdit,
  setUserToEdit
}) {
  const classes = useStyles();

  const AddPlayerSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    score: Yup.number()
      .min(0, "cannot be less than 0")
      .max(100, "cannot be more than 100")
      .required("Required")
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!userToEdit) {
      await createNewPlayer({
        name: values.name,
        lastname: values.lastname,
        score: values.score
      });
      resetForm();
    } else {
      await updateAPlayer(
        {
          id: userToEdit.id,
          name: values.name,
          lastname: values.lastname,
          score: values.score
        },
        userToEdit
      );
      setUserToEdit(null);
      resetForm();
    }
  };

  return (
    <Formik
      initialValues={
        userToEdit
          ? { ...userToEdit }
          : {
              name: "",
              lastname: "",
              score: ""
            }
      }
      validationSchema={AddPlayerSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        isValid,
        handleSubmit
      }) => (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              {userToEdit ? "Edit a player" : "Add a player"}
            </Typography>
            <form className={classes.form} noValidate>
              <CustomTextField
                value={values.name}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="First Name"
                name="name"
                onChange={handleChange}
                autoFocus
                error={touched.name && errors.name ? true : false}
                onBlur={handleBlur}
              />
              <CustomTextField
                value={values.lastname}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                onChange={handleChange}
                error={touched.lastname && errors.lastname ? true : false}
                onBlur={handleBlur}
              />
              <CustomTextField
                value={values.score}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="score"
                label="Score"
                name="score"
                onChange={handleChange}
                error={touched.score && errors.score ? true : false}
                onBlur={handleBlur}
                helperText="enter score from 0 to 100"
                type="number"
              />

              <Button
                fullWidth
                variant="contained"
                onClick={() => handleSubmit()}
                color="primary"
                disabled={!isValid}
                className={classes.submit}
              >
                {userToEdit ? "Edit" : "Add"}
              </Button>
            </form>
          </div>
        </Container>
      )}
    </Formik>
  );
}
