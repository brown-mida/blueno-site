import React from 'react';
import Grid from '@material-ui/core/Grid';

const DataView = ({ dataName, imageInfos, offset, parentStyles }) => {
  // TODO(luke): Labels with the images
  const baseURL = 'https://storage.googleapis.com/elvos-public/processed';
  // Render 15 of the items
  const images = imageInfos.slice(offset, offset + 15).map(info => {
    const occlusionLoc = info['Location of occlusions on CTA (Matt verified)'];
    let occlusionLabel;
    if (occlusionLoc === '') {
      occlusionLabel = (
        <p>
          <b style={{ color: 'red' }}> Negative</b>
        </p>
      );
    } else {
      occlusionLabel = (
        <p>
          <b style={{ color: 'green' }}>{occlusionLoc}</b>
        </p>
      );
    }
    return (
      <Grid item xs={4}>
        {/* TODO(luke): Update when no longer using Anon ID */}
        <img
          src={`${baseURL}/${dataName}/arrays/${info['Anon ID']}.png`}
          alt={info}
        />
        {occlusionLabel}
      </Grid>
    );
  });

  return (
    <Grid container spacing={8} style={parentStyles.grid}>
      <Grid item xs={12}>
        <h2>Dataset: {dataName}</h2>
      </Grid>
      {images}
    </Grid>
  );
};

export default DataView;
