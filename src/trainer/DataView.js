import React from 'react';
import { List, Card } from 'antd';

const DataView = ({ dataName, imageInfos, offset }) => {
  // TODO(luke): Labels with the images
  const baseURL = 'https://storage.googleapis.com/elvos-public/processed';
  // Render 15 of the items
  const images = imageInfos.slice(offset, offset + 15).map(info => {
    const occlusionLabel = info['occlusion_exists'];
    return (
      <List.Item>
        <Card
          cover={
            <img
              src={`${baseURL}/${dataName}/arrays/${info['Anon ID']}.png`}
              alt={info}
            />
          }
        >
          <Card.Meta title={`Class: ${occlusionLabel}`} />
        </Card>
      </List.Item>
    );
  });

  return (
    <div>
      <h2>Dataset: {dataName}</h2>
      <List grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}>
        {images}
      </List>
    </div>
  );
};

export default DataView;
