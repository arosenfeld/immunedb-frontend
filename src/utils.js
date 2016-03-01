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

var ntColors = {
  'A': '#ff0000',
  'T': '#0000ff',
  'C': '#00ff00',
  'G': '#ff8c00'
}

var ntToAA = {
  'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L', 'TCT': 'S', 'TCC':
  'S', 'TCA': 'S', 'TCG': 'S', 'TAT': 'Y', 'TAC': 'Y', 'TAA': '*',
  'TAG': '*', 'TGT': 'C', 'TGC': 'C', 'TGA': '*', 'TGG': 'W', 'CTT':
  'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L', 'CCT': 'P', 'CCC': 'P',
  'CCA': 'P', 'CCG': 'P', 'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG':
  'Q', 'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'ATT': 'I',
  'ATC': 'I', 'ATA': 'I', 'ATG': 'M', 'ACT': 'T', 'ACC': 'T', 'ACA':
  'T', 'ACG': 'T', 'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
  'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R', 'GTT': 'V', 'GTC':
  'V', 'GTA': 'V', 'GTG': 'V', 'GCT': 'A', 'GCC': 'A', 'GCA': 'A',
  'GCG': 'A', 'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E', 'GGT':
  'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
}

export function aaColor(aa) {
  return aaColors[aa] || '#000000';
}

export function aaFromCodon(codon) {
  return ntToAA[codon] || null;
}

export function removeAlleles(fullGene) {
  let index = fullGene.search(/\d+/);
  if (index < 0) {
    return fullGene;
  }
  let prefix = fullGene.slice(0, index);
  return prefix + _.uniq(_.map(fullGene.slice(index).split('|'), (gene) => {
    let alleleStart = gene.search(/[*]/);
    if (alleleStart < 0) {
      return gene;
    }
    return gene.slice(0, alleleStart);
  })).join('|');
}

function colorSeq(seq, lookup) {
  return _.map(seq, (s, i) => {
    return <span key={i} style={{color: lookup[s]}}>{s}</span>;
  });
}

export function colorAAs(seq) {
  return colorSeq(seq, aaColors);
}

export function colorNTs(seq) {
  return colorSeq(seq, ntColors);
}

export function optional(value, filler='N/A') {
  if (value) {
    return value;
  }
  return <span className="faded">{filler}</span>
}
