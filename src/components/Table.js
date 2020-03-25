import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: "650px",
    margin: "20px auto"
  },
});

export const AsteroidsTable = props => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Speed (km/h)</TableCell>
            <TableCell align="right">Min diameter</TableCell>
            <TableCell align="right">Max diameter</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.asteroids.map(asteroid => (
            <TableRow key={asteroid.name}>
              <TableCell component="th" scope="row">
                {asteroid.close_approach_data[0].close_approach_date}
              </TableCell>
              <TableCell align="right">{asteroid.name}</TableCell>
              <TableCell align="right">{asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour}</TableCell>
              <TableCell align="right">{asteroid.estimated_diameter.kilometers.estimated_diameter_min}</TableCell>
              <TableCell align="right">{asteroid.estimated_diameter.kilometers.estimated_diameter_max}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
