import React from "react";
import MozPDF from "react-pdf-js";
import { Grid, IconButton } from "@material-ui/core";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";

interface IProps {
  pdf_url: string;
}

interface IState {
  page: number;
  totalPages: number;
}

class PDFViewer extends React.Component<IProps, IState> {
  state = { page: 1, totalPages: 1 };

  render() {
    return (
      <Grid container>
        <Grid item>
          <Grid container direction="column">
            <IconButton
              disabled={this.state.page === 1}
              onClick={() => {
                if (this.state.page <= 1) {
                  return;
                }
                this.setState(state => ({
                  ...state,
                  page: state.page - 1,
                  lastPage: false,
                }));
              }}
            >
              <ArrowLeft style={{ fontSize: "300%" }} />
            </IconButton>
            <IconButton
              disabled={this.state.page === this.state.totalPages}
              onClick={() => {
                if (this.state.page >= this.state.totalPages) {
                  return;
                }
                this.setState(state => ({
                  ...state,
                  page: state.page + 1,
                }));
              }}
            >
              <ArrowRight style={{ fontSize: "300%" }} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <MozPDF
            file={this.props.pdf_url}
            page={this.state.page}
            onDocumentComplete={totalPages =>
              this.setState(state => ({ ...state, totalPages }))
            }
          />
        </Grid>
      </Grid>
    );
  }
}

export default PDFViewer;
