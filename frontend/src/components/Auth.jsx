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
import dayjs from "dayjs";
import { loginAccount, registerAccount } from "../api/all/user";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { loginAction } from "../store/actions/account";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [data, setData] = useState({});

  const onSubmit = () => {
    setIsDisabled(true);

    loginAccount(JSON.stringify(data))
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
        <TextField
          disabled={isDisabled}
          label="Email"
          variant="outlined"
          type="email"
          required
          onChange={(e) => onChangeField("email", e.target.value)}
        />
        <TextField
          disabled={isDisabled}
          label="Password"
          variant="outlined"
          type="password"
          required
          onChange={(e) => onChangeField("password", e.target.value)}
        />
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          variant="contained"
          type="submit"
        >
          Login
        </Button>
      </Stack>
    </FormControl>
  );
};

const initialValues = {
  gender: "male",
  wasBorn: dayjs(),
};

const RegistrationForm = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [data, setData] = useState({ ...initialValues });
  const dispatch = useDispatch();

  const onSubmit = () => {
    setIsDisabled(true);

    const formData = new FormData();

    const { name, email, gender, password, image, wasBorn } = data;

    formData.append("file", image, image.name);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("wasBorn", wasBorn);

    registerAccount(formData)
      .then((res) => {
        if (res.json.data?.id) {
          res.json.data._id = res.json.data.id;
          dispatch(loginAction(res.json.data));

          toast.success("Successfully registrated!");
        }
      })
      .finally(() => setIsDisabled(false));
  };

  const onChangeField = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          <DesktopDatePicker
            label="Date was born"
            inputFormat="MM/DD/YYYY"
            value={data.wasBorn}
            onChange={(e) => onChangeField("wasBorn", e)}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>

          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={data.gender}
            required
            onChange={(e) => onChangeField("gender", e.target.value)}
          >
            <FormControlLabel
              value="male"
              checked={"male" === data.gender}
              control={<Radio />}
              label="Male"
              disabled={isDisabled}
            />
            <FormControlLabel
              disabled={isDisabled}
              value="female"
              checked={"female" === data.gender}
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>

          <FormLabel id="demo-radio-buttons-group-label">Image</FormLabel>

          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => onChangeField("image", e.target.files[0])}
            />
            <PhotoCamera />
            {data?.image?.name}
          </IconButton>

          <Button disabled={isDisabled} variant="contained" onClick={onSubmit}>
            Sign up
          </Button>
        </Stack>
      </LocalizationProvider>
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
