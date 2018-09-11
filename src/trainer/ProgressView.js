import React, { Component } from 'react';
import axios from 'axios';
import * as moment from 'moment';

// Returns a UTC date without the timezone as a displayable string
const formatLocal = dateStr => {
  return moment
    .utc(dateStr)
    .local()
    .format('ddd, h:mmA');
};

class ProgressView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
    };
  }

  componentDidMount() {
    axios
      .get('/jobs')
      .then(response => {
        this.setState({
          jobs: response.data.map(e => ({
            jobName: e.jobName,
            createdAt: e.createdAt,
          })),
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    console.log(this.state.jobs);
    const jobElements = this.state.jobs.map(e => {
      return (
        <p>
          <b>{e.jobName}</b> created on {formatLocal(e.createdAt)}
        </p>
      );
    });
    return (
      <div>
        Jobs take around 30 minutes to complete. When done, results will appear
        automatically. In the future, email notifications can be configured.
        <h4>Recent Jobs</h4>
        {jobElements}
      </div>
    );
  }
}

export default ProgressView;
