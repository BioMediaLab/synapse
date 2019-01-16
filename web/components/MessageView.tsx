import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  Grid,
  Typography,
  createStyles,
  withStyles,
  Theme,
  Chip,
} from "@material-ui/core";
import { distanceInWordsToNow } from "date-fns";

import { Router } from "../Router";
import ProfilePic from "./ProfilePic";
import RenderMessage from "./RenderMessage";

const styles = createStyles((theme: Theme) => {
  const bg =
    theme.palette.type === "light"
      ? theme.palette.grey["200"]
      : theme.palette.grey["800"];
  return {
    root: {
      backgroundColor: bg,
      padding: theme.spacing.unit,
      borderRadius: theme.spacing.unit * 3,
      width: "90%",
      marginTop: theme.spacing.unit * 2,
    },
    userChip: {
      marginRight: theme.spacing.unit,
    },
    bodyText: {
      padding: theme.spacing.unit,
    },
    titleText: {
      marginRight: theme.spacing.unit * 4,
    },
  };
});

interface IMessageViewProps {
  creator: {
    name: string;
    photo: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  body: string;
  title: string;
  classes: {
    root: string;
    userChip: string;
    bodyText: string;
    titleText: string;
  };
}

const MessageView: React.SFC<IMessageViewProps> = props => {
  const howLongAgo = distanceInWordsToNow(new Date(props.createdAt));
  return (
    <Grid container direction="column" className={props.classes.root}>
      <Grid item>
        <Grid container>
          <Grid item className={props.classes.titleText}>
            <Typography variant="h6">{props.title}</Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Chip
                onClick={() => Router.pushRoute(`/users/${props.creator.id}`)}
                avatar={
                  <ProfilePic
                    user={{
                      name: props.creator.name,
                      photo: props.creator.photo,
                    }}
                  />
                }
                label={props.creator.name}
                className={props.classes.userChip}
              />
              <Typography variant="caption"> {howLongAgo} ago</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="body2" className={props.classes.bodyText}>
          <RenderMessage editorStateJson={props.body} />
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(MessageView);
