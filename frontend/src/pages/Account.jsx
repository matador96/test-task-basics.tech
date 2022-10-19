import React, { useState } from "react";
import PageTitle from "./../components/PageTitle";
import { useSelector } from "react-redux";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import { updateAccount } from "../api/all/user";
import { useDispatch } from "react-redux";
import { updateAction } from "../store/actions/account";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";

const AccountFields = () => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [data, setData] = useState({});
  const acc = useSelector((state) => state.account);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const onClick = () => {
    setIsDisabled(true);
    const { name, password, image } = data;

    const formData = new FormData();
    // not good :(
    if (image) {
      formData.append("file", image, image.name);
    }

    if (name) {
      formData.append("name", name);
    }

    if (password) {
      formData.append("password", password);
    }

    updateAccount(formData)
      .then((res) => {
        dispatch(updateAction(res.json.data));
        toast.success("Successfully updated!");
        setData({});
      })
      .finally(() => setIsDisabled(false));
  };

  const onChangeField = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const modifiedData = { ...acc, ...data };

  return (
    <FormControl>
      <Stack spacing={2}>
        <TextField
          disabled={isDisabled}
          label="Name"
          variant="outlined"
          type="name"
          required
          value={modifiedData.name}
          onChange={(e) => onChangeField("name", e.target.value)}
        />
        <TextField
          disabled={isDisabled}
          label="Password"
          variant="outlined"
          required
          type={showPassword ? "text" : "password"}
          onChange={(e) => onChangeField("password", e.target.value)}
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {!data?.image && (
          <Avatar
            alt={modifiedData.name}
            src={`/api/${modifiedData.image}`}
            style={{ height: 100, width: 100 }}
          />
        )}

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
          {data?.image && data?.image?.name}
        </IconButton>

        <Button disabled={isDisabled} variant="contained" onClick={onClick}>
          Saves
        </Button>
      </Stack>
    </FormControl>
  );
};

const Account = () => {
  const account = useSelector((state) => state.account);
  const isLogined = !!account?._id;

  return (
    <>
      <PageTitle>Account</PageTitle>
      <Box>{isLogined && <AccountFields />}</Box>
    </>
  );
};
export default Account;
