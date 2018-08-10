import React, { Component } from 'react';

import { get } from '../utils/Backend';

import '../assets/LogTab.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visMode: 'axial',
      currentDataset: 'default',
      datasets: [],
      dataLog: [],
    };

    this.handleClickDataset = this.handleClickDataset.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    get(`get-datasets-from-user?user=${this.props.user}`).then(res => {
      this.setState({
        datasets: res.data,
      });
    });

    get(
      `get-dataset?user=${this.props.user}&dataset=${this.state.currentDataset}`
    ).then(res => {
      const fileLoading = [];
      res.data.forEach(each => {
        fileLoading.push(each);
      });

      res.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      this.setState({
        dataLog: res.data,
      });
    });
  }

  handleClickDataset(dataset) {
    return () => {
      if (this.state.currentDataset !== dataset) {
        get(`get-dataset?user=${this.props.user}&dataset=${dataset}`).then(
          res => {
            const fileLoading = [];
            res.data.forEach(each => {
              fileLoading.push(each);
            });

            res.data.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });

            this.setState({
              dataLog: res.data,
              currentDataset: dataset,
            });
          }
        );
      }
    };
  }

  handleRefresh() {
    get(
      `get-dataset?user=${this.props.user}&dataset=${this.state.currentDataset}`
    ).then(res => {
      const fileLoading = [];
      res.data.forEach(each => {
        fileLoading.push(each);
      });

      res.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      this.setState({
        dataLog: res.data,
      });
    });
  }

  render() {
    return (
      <div>
        Current Dataset
        <div className="dropdown">
          <button
            className="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.state.currentDataset}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {this.state.datasets.map(each => {
              return (
                <span
                  key={each}
                  className="dropdown-item"
                  onClick={this.handleClickDataset(each)}
                >
                  {each}
                </span>
              );
            })}
          </div>
          <div className="card log-card">
            <div className="card-body">
              {this.state.dataLog.map(file => {
                return (
                  <p
                    style={{ fontSize: '0.8em', marginBottom: '0' }}
                    key={file.name}
                    className="card-text"
                  >
                    {file.name}: {file.message}
                  </p>
                );
              })}
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={this.handleRefresh}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

export default App;
