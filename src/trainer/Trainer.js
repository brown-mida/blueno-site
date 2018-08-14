import React, { Component } from 'react';
import axios from 'axios';

import { Button, Form, Input, Layout, Select } from 'antd';

import ResultsView from './ResultsView';
import DataView from './DataView';
import GuideView from './GuideView';
import NavbarDataset from '../components/NavbarDataset';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// TODO(luke): This won't work in 2020. This kind of code appears
// in a few other places as well.
function sortByDate(a, b, ascending = true) {
  const aDateIndex = a.indexOf('201');
  const bDateIndex = b.indexOf('201');
  const aDate = a.slice(aDateIndex);
  const bDate = b.slice(bDateIndex);

  const sign = ascending === true ? 1 : -1;

  if (aDate < bDate) {
    return -sign;
  }

  if (aDate > bDate) {
    return sign;
  }

  return 0;
}

// TODO: Integrate the user prop (and dataset prop when it's created).
class Trainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataName: '',
      authorName: 'web-luke',
      jobName: 'web-job',
      modelName: 'resnet',
      // Keep the hyper-parameters as strings and use the material-ui
      // components to validate the input.
      valSplit: '0.1',
      // TODO(luke): Validate as integer but not float
      batchSize: '8',
      maxEpochs: '70',

      allDataNames: [],
      imageInfos: [],
      offset: 0,

      allPlots: [],
      selectedPlot: '',
      plotSortType: 'date',

      viewType: 'guide',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handlePlotChange = this.handlePlotChange.bind(this);
    this.sendJobRequest = this.sendJobRequest.bind(this);
  }

  componentDidMount() {
    // Set allPlots and selectedPLot
    axios
      .get('/plots')
      .then(response => {
        this.setState({
          allPlots: response.data,
          selectedPlot: response.data[0],
        });
      })
      .catch(error => {
        console.error(error);
      });

    // Set allDataNames
    axios
      .get('/data')
      .then(response => {
        this.setState({
          allDataNames: response.data,
        });
        const dataName = response.data[0];
        // Set the selectedData so urls also load
        axios
          .get('/data/' + dataName + '/labels')
          .then(response => {
            this.setState({
              dataName,
              imageInfos: response.data,
            });
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }

  sendJobRequest() {
    const data = this.state;
    axios
      .post('/model', data)
      .then(response => {
        console.log(response);
        this.setState({
          viewType: 'progress',
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Handles general changes in the input fields
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  handleSelectChange(name) {
    return value => {
      this.setState({
        [name]: value,
      });
    };
  }

  // When the  data is changed, ImageURLs is also updated
  handleDataChange(dataName) {
    // Update imageInfos
    axios
      .get('/data/' + dataName + '/labels')
      .then(response => {
        this.setState({
          dataName,
          imageInfos: response.data,
          viewType: 'data',
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handlePlotChange(selectedPlot) {
    this.setState({
      selectedPlot,
      viewType: 'results',
    });
  }


  renderTrainingForm() {
    const dataOptions = this.state.allDataNames.map(name => {
      return (
        <Select.Option key={name} value={name}>
          {name}
        </Select.Option>
      );
    });

    return (
      <Form>
        <Form.Item {...formItemLayout} label="Job Name">
          <Input
            id="jobName"
            value={this.state.jobName}
            onChange={this.handleChange('jobName')}
          />
        </Form.Item>

        <Form.Item {...formItemLayout} label="Your Name">
          <Input
            id="authorName"
            value={this.state.authorName}
            onChange={this.handleChange('authorName')}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Data">
          <Select
            value={this.state.dataName}
            onChange={this.handleDataChange}
          >
            {dataOptions}
          </Select>
        </Form.Item>

        <Form.Item {...formItemLayout} label="Model">
          <Select
            value={this.state.modelName}
            onChange={this.handleSelectChange('modelName')}
          >
            <Select.Option value={'resnet'}>ResNet</Select.Option>
          </Select>
        </Form.Item>

        {/* TODO: Colllapse advanced options + state variables*/}
        {/*<Form.Item {...formItemLayout} label="Split Type">*/}
          {/*<Select*/}
            {/*value={this.state.modelName}*/}
            {/*onChange={this.handleChange('modelName')}*/}
          {/*>*/}
            {/*<Select.Option value={'train-val'}>*/}
              {/*Training and Validation*/}
            {/*</Select.Option>*/}
            {/*<Select.Option value={'train-test-val'}>*/}
              {/*Training, Test, and Validation*/}
            {/*</Select.Option>*/}
          {/*</Select>*/}
        {/*</Form.Item>*/}

        <Button color="primary" onClick={this.sendJobRequest}>
          Train Model
        </Button>
      </Form>
    );
  }

  renderResultsForm() {
    const sortedAllPlots = this.state.allPlots
      .slice()
      .sort((a, b) => sortByDate(a, b, false));

    const plotOptions = sortedAllPlots.map(e =>
      <Select.Option key={e} value={e}>
        {e}
      </Select.Option>
    );

    return (
      <Form>
        <Form.Item label="Plots">
          <Select
            value={this.state.selectedPlot}
            onChange={this.handlePlotChange}
          >
            {plotOptions}
          </Select>
        </Form.Item>

        <Button href="http://104.196.51.205:5601/">Kibana</Button>
        <Button href="https://elvomachinelearning.slack.com/">
          Slack
        </Button>
      </Form>
    );
  }

  render() {
    // TODO(luke): Descriptions of the different fields.
    let siderForm;
    let bodyView;
    switch (this.state.viewType) {
      case 'data':
        siderForm = this.renderTrainingForm();
        bodyView = (
          <DataView
            dataName={this.state.dataName}
            imageInfos={this.state.imageInfos}
            offset={this.state.offset}
          />
        );
        break;
      case 'results':
        siderForm = this.renderResultsForm();
        bodyView = <ResultsView selectedPlot={this.state.selectedPlot} />;
        break;
      case 'guide':
        siderForm = this.renderTrainingForm();
        bodyView = <GuideView />;
        break;
      default:
        console.error(this.state.viewType + ' is not valid');
        bodyView = <div>Error :(</div>;
    }

    return (
      <div style={{ height: '100vh' }}>
        {/* TODO: Make the user explicit */}
        <NavbarDataset user={'abc'} />
        <Layout>
          <Layout.Sider
            style={{ padding: 10 }}
            trigger={null}
            collapsible
            theme="light"
            width="25vw"
          >
            <h3>Training on Dataset {/* TODO: prop for dataset */}</h3>
            <Button.Group>
              <Button onClick={this.handleChange('viewType')} value="data">
                Data
              </Button>
              <Button onClick={this.handleChange('viewType')} value="results">
                Results
              </Button>
              <Button onClick={this.handleChange('viewType')} value="guide">
                Guide
              </Button>
            </Button.Group>
            {siderForm}
          </Layout.Sider>
          <Layout.Content
            style={{
              height: '92vh',
              overflowY: 'scroll',
              padding: 10,
            }}
          >
            {bodyView}
          </Layout.Content>
        </Layout>
      </div>
    );
  }
}

export default Trainer;
