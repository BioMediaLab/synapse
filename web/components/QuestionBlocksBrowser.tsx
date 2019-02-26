import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

const QBLOCK_LIST_QUERY = gql`
  query($courseId: ID!) {
    course(where: { id: $courseId }) {
	  id
      questionBlocks {
        id
        blockName
        instructions
      }
    }
  }
`;

const QBLOCK_GET_QUERY = gql`
  query($blockId: ID!) {
    getQuestionBlock(block_id: $blockId) {
      id
      blockName
      instructions
      questions {
        id
        position
        question {
          id
          questionText
          type
          answerChoices {
            id
            answerText
            position
            points
          }
        }
      }
    }
  }
`;

interface IProps {
  courseId: string;
}

interface IState {
  curQuestionBlock: string;
}

class QuestionBlocksBrowser extends React.Component<IProps, IState> {
  state = {
    curQuestionBlock: "",
  };
  updateSelectedBlock = (id: string) => {
    this.setState(state => ({ ...state, curQuestionBlock: id }));
  };
  updateChoice = (answerId, questionId) => {
    console.log('answerId: ', answerId, ' questionId:', questionId, 'block: ',  this.state.curQuestionBlock);
  }

  render() {
    const { courseId } = this.props;
    const curBlock = this.state.curQuestionBlock;
    const blockView =
      curBlock.length === 0 ? (
        <span />
      ) : (
        <Paper>
          <Query query={QBLOCK_GET_QUERY} variables={{ blockId: curBlock }}>
            {({ error, loading, data }) => {
              if (error) {
                return <ErrorMessage message={error.message} />;
              }
              if (loading) {
                return <CircularProgress />;
              }
              const {
                getQuestionBlock: { blockName, questions },
              } = data;
              return (
                <Grid container direction="column">
                  <Grid item>
                    <Typography variant="h5">{blockName}</Typography>
                  </Grid>
                  <Grid item>
                    {questions.map(questions => (
                      <div>{questions.question.questionText}
					  <List>
					    {questions.question.answerChoices.map((answer) => (
						  <ListItem>
							<input type="radio" name={questions.question.id} onClick={(e) => this.updateChoice(answer.id, questions.question.id)} /> <label for={answer.id}>{answer.answerText}</label>
						  </ListItem>
						))}
					  </List>
					  </div>
                    ))}
                  </Grid>
                </Grid>
              );
            }}
          </Query>
        </Paper>
      );

    return (
      <div>
        <Grid container>
          <Grid item xs={3}>
            <Query query={QBLOCK_LIST_QUERY} variables={{ courseId }}>
              {({ error, loading, data }) => {
                if (error) {
                  return <ErrorMessage message={error.message} />;
                }
                if (loading) {
                  return <CircularProgress />;
                }
                return (
                  <List>
                    {data.course.questionBlocks.map(block => (
                      <ListItem
                        key={block.id}
                        onClick={() => this.updateSelectedBlock(block.id)}
                      >
                        <ListItemText>{block.blockName}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                );
              }}
            </Query>
          </Grid>
          <Grid item xs={9}>
            {blockView}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default QuestionBlocksBrowser;
// https://stackoverflow.com/questions/48014390/how-to-handle-multiple-radio-button-groups-in-one-component-in-reactjs
// may have the answer
