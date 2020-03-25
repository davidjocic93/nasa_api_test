import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    margin: "10px"
  },
  ["number-of-passes-button"]: { // eslint-disable-line no-useless-computed-key
    marginTop: "10px"
  }
});

export const SelectedAsteroidsTable = props => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TableContainer className={classes.table} component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {props.selectedAsteroids.map(selectedAsteroid => (
              <TableRow key={selectedAsteroid.name}>
                <TableCell scope="row" align="left">
                  <IconButton aria-label="delete" onClick={() => props.removeSelectedAsteroid(selectedAsteroid)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="right" scope="row">{selectedAsteroid.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link style={{ textDecoration: "none" }} to="/chart">
        <Button
          variant="contained"
          color="primary"
          className={classes["number-of-passes-button"]}
        >
          Show number of passes
        </Button>
      </Link>
    </div>
  );
}
