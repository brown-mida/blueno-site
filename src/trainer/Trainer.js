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

// TODO(luke): Integrate the user prop (and dataset prop when it's created).
// TODO(luke): Add support for viewing in-progress training jobs
/**
 * The Training page.
 *
 * This page supports the following functionality:
 * - submitting training jobs
 * - selecting and viewing already-processed datasets
 * - selecting and viewing model results plots
 */
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
    // Set the allPlots and selectedPlot state fields
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
        // Set selectedData so the image urls also load
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

  /**
   * Sends a model training job request, using the component
   * state as the payload.
   */
  sendJobRequest() {
    // TODO(luke): Make this function unreliant on the state.
    // TODO(luke): Be explicit about which fields to send to the server
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

  /**
   * Handles onChange events for most input fields
   *
   * @param name - the this.state field to change
   * @returns an event handling function for name
   */
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value,
      });
    };
  }

  /**
   * Handles onChange events for Ant Design Select elements
   *
   * @param name - the this.state field to change
   * @returns {Function} - an select handling function
   */
  handleSelectChange(name) {
    return value => {
      this.setState({
        [name]: value,
      });
    };
  }

  /**
   * Handles changes to the Data select, requesting data
   * from the server and updating the dataName, imageInfo,
   * and viewType fields.
   *
   * @param dataName - the string to set this.state.dataName to
   */
  handleDataChange(dataName) {
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

  /**
   * Handles changes to the Plot select, updating the selectedPlot
   * and viewType state fields.
   *
   * @param selectedPlot the string to set this.state.selectedPlot to
   */
  handlePlotChange(selectedPlot) {
    this.setState({
      selectedPlot,
      viewType: 'results',
    });
  }

  /**
   * Returns a form which contains options for building
   * model training jobs.
   *
   * The returned view is reliant on various state fields.
   */
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
          <Select value={this.state.dataName} onChange={this.handleDataChange}>
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

  /**
   * Returns a form which can be used to view
   * different results.
   *
   * The returned view is reliant on various state fields.
   */
  renderResultsForm() {
    const sortedAllPlots = this.state.allPlots
      .slice()
      .sort((a, b) => sortByDate(a, b, false));

    const plotOptions = sortedAllPlots.map(e => (
      <Select.Option key={e} value={e}>
        {e}
      </Select.Option>
    ));

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
        {/* TODO: Make the user dependent on a passed in prop */}
        <NavbarDataset user={'abc'} />
        <Layout>
          <Layout.Sider
            style={{ padding: 10 }}
            trigger={null}
            collapsible
            theme="light"
            width="25vw"
          >
            <h3>Training on Dataset: ELVO {/* TODO: prop for dataset */}</h3>
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
