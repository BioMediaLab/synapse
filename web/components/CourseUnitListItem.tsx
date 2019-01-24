import React, { Component } from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddFileToUnitButton from "./AddFileToUnitButton";
import List from "@material-ui/core/List";
import { unstable_Box as Box } from "@material-ui/core/Box";

// dynamic import with no SSR because of window object
import dynamic from "next/dynamic";
const FileViewerDialog = dynamic(() => import("./FileViewerDialog"), {
  ssr: false,
});

const styles = theme =>
  createStyles({
    root: {
      width: "100%",
      marginBottom: theme.spacing.unit,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: "bold",
      flexShrink: 0,
      marginRight: theme.spacing.unit,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    expansionPanelDetails: {
      padding: 0,
    },
    customActionPanel: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    list: {
      width: "100%",
    },
    itemCount: {
      fontWeight: "bold",
    },
  });

class CourseUnitListItem extends Component {
  state = {
    expanded: null,
    checked: [0],
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes, courseId, unit } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={this.handleChange("panel1")}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{unit.name} </Typography>
            <Typography className={classes.secondaryHeading}>
              {unit.description}
            </Typography>
          </ExpansionPanelSummary>

          <Box
            flexDirection="row-reverse"
            className={classes.customActionPanel}
          >
            <AddFileToUnitButton courseId={courseId} unitId={unit.id} />
          </Box>

          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            <List className={classes.list}>
              {unit.contentPieces.map(contentPiece => {
                return (
                  <FileViewerDialog
                    key={contentPiece.id}
                    contentPiece={contentPiece}
                  />
                );
              })}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(CourseUnitListItem);
