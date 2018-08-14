import React from 'react';
import { Card, List } from 'antd';

const styles = {
  plotImg: {
    maxWidth: '60%',
  },
};

const plotUrl = (jobWithDate, plotType) => {
  return (
    'https://storage.googleapis.com/elvos-public/plots/' +
    jobWithDate +
    '/' +
    plotType +
    '.png'
  );
};

const ResultsView = ({ selectedPlot }) => {
  return (
    <List>
      <h2>Results from {selectedPlot}</h2>
      <List.Item>
        <Card title="Loss History">
          <img
            src={plotUrl(selectedPlot, 'loss')}
            style={styles.plotImg}
            alt="loss"
          />
        </Card>
      </List.Item>

      <List.Item>
        <Card title="Accuracy History">
          <img
            src={plotUrl(selectedPlot, 'acc')}
            style={styles.plotImg}
            alt="accuracy"
          />
        </Card>
      </List.Item>

      <List.Item>
        <Card title="Confusion Matrix">
          <img
            src={plotUrl(selectedPlot, 'cm')}
            style={styles.plotImg}
            alt="confusion matrix"
          />
        </Card>
      </List.Item>

      <List.Item>
        <Card title="True Positives">
          <img
            src={plotUrl(selectedPlot, 'true_positives')}
            style={styles.plotImg}
            alt="true positives"
          />
        </Card>
      </List.Item>

      <List.Item>
        <Card title="False Positives">
          <img
            src={plotUrl(selectedPlot, 'false_positives')}
            style={styles.plotImg}
            alt="false positives"
          />
        </Card>
      </List.Item>

      <List.Item>
        <Card title="True Negatives">
          <img
            src={plotUrl(selectedPlot, 'true_negatives')}
            style={styles.plotImg}
            alt="true negatives"
          />
        </Card>
      </List.Item>

      <List.Item>
        <Card title="False Negatives">
          <img
            src={plotUrl(selectedPlot, 'false_negatives')}
            style={styles.plotImg}
            alt="false negatives"
          />
        </Card>
      </List.Item>
    </List>
  );
};

export default ResultsView;
