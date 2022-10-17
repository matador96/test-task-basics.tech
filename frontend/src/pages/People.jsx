import React, { useEffect, useState } from "react";
import { getPeople } from "../api/all/user";
import PageTitle from "./../components/PageTitle";
import map from "lodash/map";
import UserCard from "../components/UserCard";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";

const People = () => {
  const [data, setData] = useState("login");

  useEffect(() => {
    getPeople().then((result) => setData(result.json.data));
  }, []);

  return (
    <>
      <PageTitle>People</PageTitle>

      <Box>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {map(data, (item, index) => (
            <Grid xs={2} sm={4} md={4} key={index}>
              <UserCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
export default People;
