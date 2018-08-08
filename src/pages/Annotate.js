import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { get } from '../utils/Backend';

import AnnotateTab from '../components/AnnotateTab';
import VisTab from '../components/VisTab';
import CreateTab from '../components/AnnotateCreateTab';
import LogTab from '../components/LogTab';
import NavbarDataset from '../components/NavbarDataset';

import '../assets/Annotator.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasetFiles: [],
      fileImages: [],
      currentTab: 'annotate',
      visMode: 'axial',
      currentDataset: 'default',
      imageMode: '3D',
      currentAnnotation: null,
      annotations: {},
    }

    this.handleClickTab = this.handleClickTab.bind(this);
    this.updateViewerStateMode = this.updateViewerStateMode.bind(this);
    this.updateViewerStateDataset = this.updateViewerStateDataset.bind(this);
    this.formatAnnotationToString = this.formatAnnotationToString.bind(this);
    this.updateFromParams = this.updateFromParams.bind(this);
  }

  handleClickTab(tab) {
    return () => {
      this.setState({
        currentTab: tab,
      });
    }
  }

  updateFromParams(params) {
    get(`get-dataset?user=${params.user}&dataset=${this.state.currentDataset}`).then((res) => {
      const files = [];
      res.data.forEach((each) => {
        if (each.status === 'loaded') {
          files.push(each);
        }
      });

      const fileImages = []
      files.forEach((each) => {
        fileImages.push({
          name: each.name,
          shape: each.shape,
          url: `/get-dataset-image?user=${params.user}` +
               `&dataset=default&type=${this.state.visMode}&name=${each.name}`
        });
      });
      this.setState({
        fileImages,
        datasetFiles: files,
      });
    });

    if (params.group) {
      return get(`annotator/get-annotations?user=${params.user}&group=${params.group}`).then((res) => {
        this.setState({
          currentAnnotation: params.group,
          annotations: res.data,
        });
      });
    } else {
      get(`annotator/get-annotation-groups?user=${this.props.match.params.user}`).then((res) => {
        if (res.data.length > 0) {
          return get(`annotator/get-annotations?user=${params.user}&group=${res.data[0].name}`).then((res2) => {
            this.setState({
              currentAnnotation: res.data[0].name,
              annotations: res2.data,
            });
          });
        }
      });
    }
  }

  componentDidMount() {
    this.updateFromParams(this.props.match.params);
  }

  componentWillReceiveProps(nextProps){
    if (this.props.match.params !== nextProps.match.params) {
      this.updateFromParams(nextProps.match.params);
    }
  }


  updateViewerStateMode(visMode) {
    const fileImages = []
    this.state.datasetFiles.forEach((each) => {
      fileImages.push({
        name: each.name,
        shape: each.shape,
        url: `/get-dataset-image?user=${this.props.match.params.user}` +
             `&dataset=${this.state.currentDataset}&type=${visMode}&name=${each.name}`
      });
    });

    this.setState({
      fileImages,
      visMode
    });
  }

  updateViewerStateDataset(currentDataset) {
    if (this.state.currentDataset !== currentDataset) {
      get(`get-dataset?user=${this.props.match.params.user}&dataset=${currentDataset}`).then((res) => {
        const files = [];
        res.data.forEach((each) => {
          if (each.status === 'loaded') {
            files.push(each);
          }
        });

        const mipped = files[0].mip;
        const fileImages = [];
        files.forEach((each) => {
          fileImages.push({
            name: each.name,
            shape: each.shape,
            url: `/get-dataset-image?user=${this.props.match.params.user}` +
                 `&dataset=${currentDataset}&type=${mipped ? 'mip' : this.state.visMode}&name=${each.name}`
          });
        });

        let imageMode;
        if (mipped) {
          imageMode = '2D';
        } else {
          imageMode = '3D';
        }
        this.setState({
          fileImages,
          datasetFiles: files,
          currentDataset,
          imageMode,
        });
      });
    }
  }

  formatAnnotationToString(id) {
    const annotation = this.state.annotations[id]
    if (annotation.class) {
      return annotation.class;
    } else {
      return `(${annotation.x1}:${annotation.x2}, ${annotation.y1}:${annotation.y2}, ${annotation.z1}:${annotation.z2})`;
    }
  }

  render() {
    return (
      <div className="upload-container">
        <NavbarDataset user={this.props.match.params.user}/>
        <div className="card preprocess-options">
          <div className="card-body">
            <h5 className="card-title">Annotating Dataset {this.props.match.params.user}</h5>
            <ul className="nav nav-tabs dataset-tabs">
              <li className="nav-item" onClick={this.handleClickTab('annotate')}>
                <a className={`nav-link ${this.state.currentTab === 'annotate' && 'active'}`} href="#">Annotate</a>
              </li>
              <li className="nav-item" onClick={this.handleClickTab('vis')}>
                <a className={`nav-link ${this.state.currentTab === 'vis' && 'active'}`} href="#">Vis</a>
              </li>
              <li className="nav-item" onClick={this.handleClickTab('create')}>
                <a className={`nav-link ${this.state.currentTab === 'create' && 'active'}`} href="#">Create</a>
              </li>
              <li className="nav-item" onClick={this.handleClickTab('log')}>
                <a className={`nav-link ${this.state.currentTab === 'log' && 'active'}`} href="#">Log</a>
              </li>
            </ul>
            { this.state.currentTab === 'annotate' &&
              <AnnotateTab
                user={this.props.match.params.user}
                currentAnnotation={this.state.currentAnnotation}
                annotations={this.state.annotations}
              />
            }
            { this.state.currentTab === 'vis' &&
              <VisTab
                user={this.props.match.params.user}
                updateViewerStateMode={this.updateViewerStateMode}
                updateViewerStateDataset={this.updateViewerStateDataset}
                imageMode={this.state.imageMode}
                visMode={this.state.visMode}
                currentDataset={this.state.currentDataset}
              />
            }
            { this.state.currentTab === 'create' &&
              <CreateTab
                user={this.props.match.params.user}
              />
            }
            { this.state.currentTab === 'log' &&
              <LogTab
                user={this.props.match.params.user}
              /> }
          </div>
        </div>
        <div className="visual-container">
          {
            this.state.fileImages.map((each) => {
              if (this.state.currentAnnotation) {
                return (
                  <Link key={each.url} to={`/u/${this.props.match.params.user}/annotate/${this.state.currentAnnotation}/${each.name}`}>
                    <div className='image-card'>
                      <img
                        src={each.url}
                        className={`image-thumbnail ${this.state.annotations[each.name] ? 'labeled' : 'not-labeled'}`}/>
                      <p>{each.name}</p>
                      {this.state.annotations[each.name] ?
                        <p>Label: {this.formatAnnotationToString(each.name)}</p> :
                        <p>No label</p>
                      }
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div key={each.url} className='image-card'>
                    <img
                      src={each.url}
                      className='image-thumbnail'/>
                    <p>{each.name}</p>
                  </div>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
