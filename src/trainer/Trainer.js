import React, { Component } from 'react';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import ResultsView from './ResultsView';
import DataView from './DataView';
import GuideView from './GuideView';
import ProgressView from './ProgressView';


const styles = {
  sidebarList: {
    float: 'left',
    height: '90vh',
    width: '300px',
    overflowY: 'scroll',
    paddingLeft: 10,
  },
  mainView: { height: '90vh', overflow: 'scroll' },
  inputField: {
    margin: 10,
  },
  grid: {
    paddingLeft: 30,
  },
};

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

      allTransforms: [],
      selectedTransforms: [],
      numTransforms: 3,
      cropLength: 200,
      mipThickness: 25,
      heightOffset: 30,
      minPixelValue: 0,
      maxPixelValue: 200,
      processedName: 'my-processed-v1',

      allDataNames: [],
      imageNames: [],
      offset: 0,

      allPlots: [],
      selectedPlot: '',
      plotSortType: 'date',

      viewType: 'guide',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleTransformChange = this.handleTransformChange.bind(this);
    this.handlePlotChange = this.handlePlotChange.bind(this);
    this.sendJobRequest = this.sendJobRequest.bind(this);
    this.sendPreprocessRequest = this.sendPreprocessRequest.bind(this);
  }

  componentDidMount() {
    // Set allPlots and selectedPLot
    axios.get('/plots')
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
    axios.get('/data')
        .then(response => {
          this.setState({
            allDataNames: response.data,
          });
          const dataName = response.data[0];
          // Set the selectedData so urls also load
          axios.get('/data/' + dataName)
              .then(response => {
                this.setState({
                  dataName,
                  imageNames: response.data,
                });
              })
              .catch((error) => {
                console.error(error);
              });
        })
        .catch(error => {
          console.error(error);
        });

    axios.get('/preprocessing/transforms')
        .then(response => {
          this.setState({
            allTransforms: response.data,
            selectedTransforms: response.data.slice(0, 3),
          });
        })
        .catch(error => {
          console.error(error);
        });

  }

  sendPreprocessRequest() {
    // TODO(luke): At some point filter the params
    const data = this.state;
    const dataName = this.state.processedName;
    axios.post('/preprocessing/' + dataName, data)
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

  sendJobRequest() {
    const data = this.state;
    axios.post('/model', data)
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

  // When the  data is changed, ImageURLs is also updated
  handleDataChange(event) {
    const dataName = event.target.value;
    // Update imageNames
    axios.get('/data/' + dataName)
        .then(response => {
          this.setState({
            dataName,
            imageNames: response.data,
            viewType: 'data',
          });
        })
        .catch((error) => {
          console.error(error);
        });
  }

  handlePlotChange(event) {
    const selectedPlot = event.target.value;
    this.setState({
      selectedPlot,
      viewType: 'results',
    });
  }

  handleTransformChange(index) {
    return event => {
      const selectedTransforms = this.state.selectedTransforms;
      selectedTransforms[index] = event.target.value;
      this.setState({
        selectedTransforms,
      });
    };
  }

  render() {
    // TODO(luke): Descriptions of the different fields.
    console.log('state', this.state);

    const transformOptions = this.state.allTransforms.map(name => {
      return <option value={name}>{name}</option>;
    });
    const dataOptions = this.state.allDataNames.map(name => {
      return <option key={name} value={name}>{name}</option>;
    });
    const sortedAllPlots = this.state.allPlots
        .slice()
        .sort((a, b) => sortByDate(a, b, false));
    const plotOptions = [];
    sortedAllPlots.forEach((e) => {
      plotOptions.push(<option key={e} value={e}>{e}</option>);
    });

    // TODO(luke): Consider at another time
    // const transformSelects = [];
    // for (let i = 0; i < this.state.numTransforms; i++) {
    //   let selected = '';
    //   if (this.state.selectedTransforms.length > 0) {
    //      selected = this.state.selectedTransforms[i];
    //   }
    //   transformSelects.push(<FormControl style={styles.inputField}>
    //     <InputLabel>Transform {i + 1}</InputLabel>
    //     <Select
    //         native
    //         value={selected}
    //         onChange={this.handleTransformChange(i)}
    //     >
    //       {transformOptions}
    //     </Select>
    //   </FormControl>);
    // }

    let bodyView;
    switch (this.state.viewType) {
      case 'data':
        bodyView = (
            <DataView
                dataName={this.state.dataName}
                imageNames={this.state.imageNames}
                offset={this.state.offset}
                parentStyles={styles}
            />
        );
        break;
      case 'results':
        bodyView = (
            <ResultsView
                selectedPlot={this.state.selectedPlot}
                parentStyles={styles}
            />
        );
        break;
      case 'guide':
        bodyView = (
            <GuideView parentStyles={styles}/>
        );
        break;
      case 'progress':
        bodyView = (
            <ProgressView
                processedName={this.state.processedName}
                parentStyles={styles}
            />
        );
        break;
      default:
        console.error(this.state.viewType + ' is not valid');
        bodyView = <div>Error :(</div>;
    }

    return (
        <div>
          <AppBar
              position="static"
          >
            <Tabs
                value={this.state.viewType}
                onChange={(event, viewType) => {
                  this.setState({ viewType });
                }}
            >
              <Tab label="Progress"
                   value="progress"/>
              <Tab label="Data" value="data"/>
              <Tab label="Results" value="results"/>
              <Tab label="Guide" value="guide"/>
            </Tabs>
          </AppBar>
          <div style={{ display: 'flex' }}>
            <Paper style={{ alignSelf: 'flex-start' }}>
              {/* Start of the sidebar */}
              {/* TODO(luke): Put style up above*/}
              <List component="nav"
                    style={styles.sidebarList}>
                <h3 style={{ paddingLeft: 10 }}>Preprocessing Options</h3>

                {/*{transformSelects}*/}
                <TextField
                    id="processedName"
                    label={'Preprocessed Data'}
                    value={this.state.processedName}
                    onChange={this.handleChange('processedName')}
                    margin="normal"
                    style={styles.inputField}
                />

                <TextField
                    id="cropLength"
                    label={'Crop Length'}
                    value={this.state.cropLength}
                    onChange={this.handleChange('cropLength')}
                    margin="normal"
                    style={styles.inputField}
                />

                <TextField
                    id="mipThickness"
                    label={'MIP Thickness'}
                    value={this.state.mipThickness}
                    onChange={this.handleChange('mipThickness')}
                    margin="normal"
                    style={styles.inputField}
                />

                <TextField
                    id="heightOffset"
                    label={'Height Offset'}
                    value={this.state.heightOffset}
                    onChange={this.handleChange('heightOffset')}
                    margin="normal"
                    style={styles.inputField}
                />

                <TextField
                    id="minPixelValue"
                    label={'Min Pixel Value'}
                    value={this.state.minPixelValue}
                    onChange={this.handleChange('minPixelValue')}
                    margin="normal"
                    style={styles.inputField}
                />

                <TextField
                    id="maxPixelValue"
                    label={'Max Pixel Value'}
                    value={this.state.maxPixelValue}
                    onChange={this.handleChange('maxPixelValue')}
                    margin="normal"
                    style={styles.inputField}
                />

                <Button
                    variant="contained" color="primary"
                    onClick={this.sendPreprocessRequest}
                >
                  Preprocess Data
                </Button>

                <div style={{ height: 20 }}/>
                <Divider/>


                <h3 style={{ paddingLeft: 10 }}>Training Options</h3>

                <TextField
                    id="jobName"
                    label={'Job Name'}
                    value={this.state.jobName}
                    onChange={this.handleChange('jobName')}
                    margin="normal"
                    style={styles.inputField}
                />

                <TextField
                    id="authorName"
                    label={'Your Name'}
                    value={this.state.authorName}
                    onChange={this.handleChange('authorName')}
                    margin="normal"
                    style={styles.inputField}
                />
                <br/>

                <FormControl style={styles.inputField}>
                  <InputLabel>Data</InputLabel>
                  <Select
                      native
                      value={this.state.dataName}
                      onChange={this.handleDataChange}
                  >
                    {dataOptions}
                  </Select>
                </FormControl>

                <FormControl style={styles.inputField}>
                  <InputLabel>Model</InputLabel>
                  <Select
                      native
                      value={this.state.modelName}
                      onChange={this.handleChange('modelName')}
                  >
                    <option value={'resnet'}>ResNet</option>
                  </Select>
                </FormControl>

                {/*<TextField*/}
                {/*id="batchSize"*/}
                {/*label={'Batch Size'}*/}
                {/*value={this.state.batchSize}*/}
                {/*onChange={this.handleChange('batchSize')}*/}
                {/*margin="normal"*/}
                {/*type="number"*/}
                {/*/>*/}

                <br/>
                <br/>

                <Button
                    variant="contained" color="primary"
                    onClick={this.sendJobRequest}
                >
                  Train Model
                </Button>

                <div style={{ height: 20 }}/>
                <Divider/>

                <h3 style={{ paddingLeft: 10 }}>Results Options</h3>

                <FormControl style={styles.inputField}>
                  <InputLabel>Plots</InputLabel>
                  <Select
                      native
                      value={this.state.selectedPlot}
                      onChange={this.handlePlotChange}
                  >
                    {plotOptions}
                  </Select>
                </FormControl>

                <Button
                    variant={'contained'}
                    color={'secondary'}
                    href={'http://104.196.51.205:5601/'}
                >Kibana</Button>
                <Button
                    variant={'contained'}
                    color={'secondary'}
                    href={'https://elvomachinelearning.slack.com/'}
                    style={{ marginLeft: 10 }}
                >Slack</Button>
              </List>
            </Paper>
            <div style={styles.mainView}>
              {bodyView}
            </div>
          </div>
        </div>
    );
  }
}

// TODO(luke): This won't work in 2020. This kind of code appears
// in a few other places as well.
function sortByDate(a, b, ascending = true) {
  const aDateIndex = a.indexOf('201');
  const bDateIndex = b.indexOf('201');
  const aDate = a.slice(aDateIndex);
  const bDate = b.slice(bDateIndex);

  const sign = (ascending === true) ? 1 : -1;

  if (aDate < bDate) {
    return -sign;
  }

  if (aDate > bDate) {
    return sign;
  }

  return 0;
}

export default Trainer;