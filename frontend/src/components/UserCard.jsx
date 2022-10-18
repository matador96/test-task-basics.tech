import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import dayjs from "dayjs";

const getAge = (date) => {
  const date1 = dayjs(date);
  const date2 = dayjs();

  let years = date2.diff(date1, "years");

  if (years === 0) {
    return "~ 1";
  }
  return years;
};

const UserCard = ({ name, gender, wasBorn, image }) => (
  <Card>
    <CardContent>
      <Avatar alt={name} src={`/api/${image}`} />
      <Typography component="div">
        Name: {name} ({gender})
      </Typography>
      <Typography component="div">Age: {getAge(wasBorn)}</Typography>
    </CardContent>
  </Card>
);

export default UserCard;
