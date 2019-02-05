import React from "react";
import AsyncSelect from "react-select/lib/Async";
import { components } from "react-select";
import { withApollo, WithApolloClient } from "react-apollo";
import gql from "graphql-tag";
import { TextField, Paper } from "@material-ui/core";

const Menu = props => {
  return (
    <Paper>
      <components.Menu {...props}>{props.children}</components.Menu>
    </Paper>
  );
};

const SEARCH_QUERY = gql`
  query($input: String, $include_all: Boolean) {
    courseSearch(name: $input, title: $input, include_all: $include_all) {
      id
      name
      title
    }
  }
`;

interface ICourseSelectOption {
  value: string;
  label: string;
  desc: string;
}

interface IProps {
  allCourses: boolean;
  disabled?: boolean;
  value: string;
  onChange: (newValue: string) => void;
}

type Props = WithApolloClient<IProps>;

class CourseSearch extends React.Component<Props> {
  static defaultProps = {
    disabled: false,
  };

  ref: any = false;

  loadOptions = async (input): Promise<ICourseSelectOption[]> => {
    const res = await this.props.client.query({
      query: SEARCH_QUERY,
      variables: {
        include_all: this.props.allCourses,
        input,
      },
    });
    if (res.errors) {
      return [];
    }
    return (res.data as any).courseSearch.map(course => ({
      label: course.name,
      value: course.id,
      ...course,
    }));
  };

  setRef = ref => {
    if (ref) {
      this.ref = ref;
    }
  };

  handleInputChange = newInput => {
    if (this.ref) {
      this.ref.handleBlur();
    }
    this.props.onChange(newInput);
    return newInput;
  };

  render() {
    const customSelectSytles = {
      control: defaultStyles => {
        return {
          display: "flex",
          flexwrap: "wrap",
          alignItems: "center",
          cursor: defaultStyles.cursor,
        };
      },
    };

    return (
      <TextField
        fullWidth
        style={{ minWidth: "25rem" }}
        innerRef={this.setRef}
        disabled={this.props.disabled}
        InputProps={{
          inputComponent: inputProps => (
            <AsyncSelect
              {...inputProps}
              tabIndex={String(inputProps.tabIndex)}
              isDisabled={this.props.disabled}
              placeholder="Search for courses"
              loadOptions={this.loadOptions}
              value={this.props.value}
              onChange={this.handleInputChange}
              styles={customSelectSytles}
              components={{
                Menu,
              }}
              defaultOptions
            />
          ),
        }}
      />
    );
  }
}

export default withApollo(CourseSearch);
