import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { loginAccount, registerAccount } from "../api/all/user";
import { useSelector } from "react-redux";

import { loginAction } from "../store/actions/account";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();

  const [data, setData] = useState({});

  const onSubmit = () => {
    setIsDisabled(true);

    loginAccount(data)
      .then((res) => {
        if (res.json.data?.id) {
          res.json.data._id = res.json.data.id;
          dispatch(loginAction(res.json.data));

          toast.success("Successfully logined!");
        }
      })
      .finally(() => setIsDisabled(false));
  };

  const onChangeField = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormControl>
      <Stack spacing={2}>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <TextField
          disabled={isDisabled}
          label="Email"
          variant="outlined"
          type="email"
          required
          onChange={(e) => onChangeField("email", e.target.value)}
          // {...register("text", { required: true })}
        />
        <TextField
          disabled={isDisabled}
          label="Password"
          variant="outlined"
          type="password"
          required
          onChange={(e) => onChangeField("password", e.target.value)}
          // {...register("text", { required: true })}
        />
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          variant="contained"
          type="submit"
        >
          Login
        </Button>
        {/* </form> */}
      </Stack>
    </FormControl>
  );
};

const RegistrationForm = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [data, setData] = useState({});

  const onClick = () => {
    setIsDisabled(true);
    registerAccount(data)
      .then((res) => {
        toast.success("Successfully registrated!");
      })
      .finally(() => setIsDisabled(false));
  };

  const onChangeField = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormControl>
      <Stack spacing={2}>
        <TextField
          disabled={isDisabled}
          label="Name"
          variant="outlined"
          type="name"
          required
          value={data.name}
          onChange={(e) => onChangeField("name", e.target.value)}
        />
        <TextField
          disabled={isDisabled}
          label="Email"
          variant="outlined"
          type="email"
          required
          value={data.email}
          onChange={(e) => onChangeField("email", e.target.value)}
        />
        <TextField
          disabled={isDisabled}
          label="Password"
          variant="outlined"
          type="password"
          required
          value={data.password}
          onChange={(e) => onChangeField("password", e.target.value)}
        />
        {/* <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={data.gender}
          required
        >
          <FormControlLabel
            disabled={isDisabled}
            value="female"
            checked={data.gender}
            control={<Radio />}
            label="Female"
          />
          <FormControlLabel
            value="male"
            checked={data.gender}
            control={<Radio />}
            label="Male"
            disabled={isDisabled}
          />
        </RadioGroup> */}
        <Button disabled={isDisabled} variant="contained" onClick={onClick}>
          Sign up
        </Button>
      </Stack>
    </FormControl>
  );
};

const Auth = () => {
  const [currentTab, setCurrentTab] = useState("login");
  const account = useSelector((state) => state.account);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const isLogined = !!account?._id;

  if (isLogined) {
    return (
      <div>
        <Box>Logined {account.name}</Box>
      </div>
    );
  }

  return (
    <div>
      <Box>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="login" label="Login" />
          <Tab value="registration" label="Registration" />
        </Tabs>

        <Box mt={2}>
          {currentTab === "login" && <LoginForm />}
          {currentTab === "registration" && <RegistrationForm />}
        </Box>
      </Box>
    </div>
  );
};

export default Auth;
