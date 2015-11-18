import React from 'react';

var aaColors = {
  'R': '#e60606',
  'K': '#c64200',
  'Q': '#ff6600',
  'N': '#ff9900',
  'E': '#ffcc00',
  'D': '#ffcc99',
  'H': '#e6a847',
  'P': '#a4993d',
  'Y': '#398439',
  'W': '#cc99ff',
  'S': '#7dd624',
  'T': '#00ff99',
  'G': '#00ff00',
  'A': '#69b3dd',
  'M': '#99ccff',
  'C': '#00ffff',
  'F': '#00ccff',
  'L': '#3366ff',
  'V': '#0000ff',
  'I': '#000080',
  '*': '#a0a0a0'
};

export function removeAlleles(fullGene) {
  let index = fullGene.search(/\d+/);
  if (index < 0) {
    return fullGene;
  }
  let prefix = fullGene.slice(0, index);
  return prefix + _.unique(_.map(fullGene.slice(index).split('|'), (gene) => {
    let alleleStart = gene.search(/[*]/);
    if (alleleStart < 0) {
      return gene;
    }
    return gene.slice(0, alleleStart);
  })).join('|');
}

export function colorAAs(seq) {
  return _.map(seq, (aa,i ) => {
    return <span key={i} style={{color: aaColors[aa]}}>{aa}</span>;
  });
}
