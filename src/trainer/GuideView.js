import React from 'react';

const GuideView = ({ parentStyles }) => {
  return (
    <div>
      <h2>User Guide</h2>
      <p>
        This app allows you to train deep learning models on the ELVO data and
        view the results.
      </p>
      <p>
        To train a model, fill in the form in the left side of the screen. The
        model should finish training within 30 minutes.
      </p>
      <p>
        After the model has finished training, you should be able to select your
        job from the plots dropdown and view plots of your model's effectiveness
        through the <b>Results</b> tab.
      </p>
      <p>
        The data input gives you a selection of already-processed data that you
        can use to train the model. Select the
        <b> Data</b> tab to see samples of the processed data.
      </p>
      <h4>Job Name</h4>
      <p>
        The name of your job, used to help you identify the models you train
      </p>
      <h4>Data</h4>
      <p>
        The type of processed data you would like to use to train your model
      </p>
      <h4>Model</h4>
      <p>
        The model type to train. Currently only 2D binary classification
        (ResNet) is supported. ELVO location detection and 3D classification
        will be supported in the future.
      </p>
      <h4>Plots</h4>
      <p>
        The training job to show plots of in the <b>Results</b> view
      </p>
      <h4>Kibana</h4>
      <p>
        A more detailed dashboard of the model results, allowing you to see
        advanced metrics and compare your job with past runs.
      </p>
    </div>
  );
};

export default GuideView;
