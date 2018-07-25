import React, { Component } from 'react';
import DropZone from 'react-dropzone';

import { get, post, postFileData } from '../utils/Backend';

import NavbarDataset from '../components/NavbarDataset';
import '../assets/Upload.css';
import '../assets/Preprocess.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileSent: {},
      fileLoading: [],
      fileImages: [],
    }
  }

  componentDidMount() {
    get(`get-dataset?user=${this.props.match.params.user}`).then((res) => {
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
          url: `http://localhost:8080/get-dataset-image?user=${this.props.match.params.user}&dataset=default&type=axial&id=${each.id}`
        });

        this.setState({
          fileImages,
        });
      });
    });
  }

  render() {
    return (
      <div className="upload-container">
        <NavbarDataset user={this.props.match.params.user}/>
        <div className="card preprocess-options">
          <div className="card-body">
            <h5 className="card-title">Dataset {this.props.match.params.user}</h5>
          </div>
        </div>
        <div className="visual-container">
          {
            this.state.fileImages.map((each) => {
              return (
                <div className='image-card'>
                  <img src={each.url} style={{maxWidth: '15vw'}}/>
                  {each.name}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
