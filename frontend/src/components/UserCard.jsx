import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const UserCard = ({ name, email }) => (
  <Card>
    <CardContent>
      <Typography gutterBottom>Name: {name}</Typography>
      <Typography component="div">Email: {email}</Typography>
    </CardContent>
  </Card>
);

export default UserCard;
