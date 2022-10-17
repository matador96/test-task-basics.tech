import React, { useEffect, useState } from "react";
import PageTitle from "./../components/PageTitle";
import { useSelector } from "react-redux";

import FormControl from "@mui/material/FormControl";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import { updateAccount } from "../api/all/user";
import { useDispatch } from "react-redux";
import { updateAction } from "../store/actions/account";

const AccountFields = () => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [data, setData] = useState({});
  const acc = useSelector((state) => state.account);

  useEffect(() => {
    setData(acc);
  }, [acc]);

  useEffect(() => {}, [data]);

  const onClick = () => {
    setIsDisabled(true);
    updateAccount(data)
      .then((res) => {
        dispatch(updateAction(res.json.data));
        toast.success("Successfully updated!");
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

        <Button disabled={isDisabled} variant="contained" onClick={onClick}>
          Save
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
