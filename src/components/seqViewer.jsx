import React from 'react';

import { aaColor, aaFromCodon, removeAlleles } from '../utils';

class SeqViewer extends React.Component {
  constructor() {
    super();
    this.TOP_PAD = 45;
    this.LEFT_PAD = 5;
    this.CHAR_SPACE = 20;
    this.V_PER_SEQ = 20;
  }

  componentDidMount() {
    this.canvas = $('#seq-view').get(0);
    this.ctx = this.canvas.getContext('2d');
    this.drawSeqs();
  }

  drawSequence = (seq, left, top) => {
    _.each(seq, (c, i) => {
      if (i % 3 == 0) {
        let nt = seq.substring(i, i + 3);
        this.ctx.fillStyle = aaColor(aaFromCodon(nt));
      }

      this.ctx.fillText(c, this.LEFT_PAD + left + (this.CHAR_SPACE * i), this.TOP_PAD + top);
    });
  }

  drawRegion = (color, left, top, char_space, start, end, text) => {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText(text, left + start * char_space, top);
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(left + start * char_space, top + 5);
    this.ctx.lineTo(left + end * char_space, top + 5);
    this.ctx.stroke();
  }


  drawSeqs = () => {
    let labelMaxLength = _.max(_.map(this.props.seqs, (seq) => {
      return (seq.sample.id + ': ' + seq.seq_id).length;
    }));

    this.canvas.width = (labelMaxLength + this.props.germline.length) * this.CHAR_SPACE;
    this.canvas.height = (this.props.seqs.length + 3) * this.V_PER_SEQ + 35;

    this.ctx.font = 'bold 12px Courier New';

    this.ctx.fillText('Germline', this.LEFT_PAD, this.TOP_PAD);
    let middlePad = (this.CHAR_SPACE - 10) * labelMaxLength;

    this.drawSequence(this.props.germline, middlePad, 0);

    let i = 0;
    let diffs = {}
    _.each(this.props.seqs, (seq, id) => {
      this.ctx.fillStyle = '#000000';
      let label = seq.sample.id + ': ' + seq.seq_id;
      this.ctx.fillText(label, this.LEFT_PAD, this.TOP_PAD + this.V_PER_SEQ
        * (1 + i));

      this.ctx.beginPath();
      this.ctx.strokeStyle = '#db0004';

      this.ctx.globalAlpha = 0.3;
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(this.LEFT_PAD + middlePad - 2,
           this.TOP_PAD + this.V_PER_SEQ * (i + 1) + 3);
      this.ctx.lineTo(this.LEFT_PAD + middlePad + (seq.v_extent - 1) *
            this.CHAR_SPACE + 8,
           this.TOP_PAD + this.V_PER_SEQ * (i + 1) + 3);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#1d912c';
      let jStart = (seq.sequence.length - seq.j_length) * this.CHAR_SPACE;
      this.ctx.moveTo(this.LEFT_PAD + middlePad + jStart - 3,
           this.TOP_PAD + this.V_PER_SEQ * (i + 1) + 3);
      this.ctx.lineTo(this.LEFT_PAD + middlePad + jStart + seq.j_length *
           this.CHAR_SPACE - 3,
           this.TOP_PAD + this.V_PER_SEQ * (i + 1) + 3);
      this.ctx.stroke()
      this.ctx.globalAlpha = 1;

      let filled_seq = this.props.germline.substring(0, seq.read_start) +
        seq.sequence.substring(seq.read_start, seq.length);

      _.each(filled_seq, (c, j) => {
        let left = this.LEFT_PAD + middlePad + (this.CHAR_SPACE * j);
        let top = this.TOP_PAD + this.V_PER_SEQ * (i + 1);
        let aaStart = j - (j % 3);
        if (j < seq.read_start) {
          this.ctx.globalAlpha = 0.2;
        }
        let nt = filled_seq.substring(aaStart, aaStart + 3);
        this.ctx.fillStyle = aaColor(aaFromCodon(nt));

        this.ctx.fillText(c, left, top);
        this.ctx.globalAlpha = 1;

        if (_.get(seq.mutations, j)) {
          if (
              this.props.mutations ||
              (j < 309 || j >= 309 + seq.cdr3_nt.length)
           ) {
            this.ctx.beginPath();
            this.ctx.rect(left - 2, top - this.CHAR_SPACE + 8, 15, 15);
            this.ctx.lineWidth = 2;

            switch (seq.mutations[j]) {
              case 'conservative':
              case 'nonconservative':
                this.ctx.strokeStyle = '#ff0000';
                break;
              case 'synonymous':
                this.ctx.strokeStyle = '#00ff00';
                break;
              case 'unknown':
                this.ctx.strokeStyle = '#1c1c1c';
                break;
            }

            this.ctx.stroke();
          }
        }
        if (j == 0 || (j + 1) % 10 == 0) {
          this.ctx.fillStyle = '#000000';
          this.ctx.fillText(j + 1, left, 10);
        }
      });
      i++;
    });

    if (this.props.seqs.length == 1 && this.props.seqs[0].quality) {
      this.ctx.fillStyle = '#777777';
      this.ctx.fillText('Phred Quality Score (Range: 0 - 41)', this.LEFT_PAD, this.TOP_PAD + (1 + this.props.seqs.length) * this.V_PER_SEQ);
      this.ctx.font = '10px Courier New';
      this.ctx.textAlign = 'center';
      _.each(this.props.seqs[0].quality, (c, offset) => {
        let left = this.LEFT_PAD + middlePad + (this.CHAR_SPACE * offset);
        if (c != ' ') {
          let quality = c.charCodeAt(0) - 33;
          this.ctx.fillStyle = 'hsl(' + (quality / 41 * 120) + ', 100%, 45%)';

          this.ctx.fillText(quality, this.LEFT_PAD + middlePad + offset *
            this.CHAR_SPACE + 5, this.TOP_PAD + (1 + this.props.seqs.length) * this.V_PER_SEQ);
        }
      });
    }

    this.ctx.textAlign = 'left';
    this.ctx.font = 'bold 12px Courier New';

    let region_info = [
      {
        'name': 'FR1',
        'color': '#0000ff'
      },{
        'name': 'CDR1',
        'color': '#00ff00'
      },{
        'name': 'FR2',
        'color': '#0000ff'
      },{
        'name': 'CDR2',
        'color': '#00ff00'
      },{
        'name': 'FR3',
        'color': '#0000ff'
      },
      {
        'name': 'CDR3',
        'color': '#00ff00'
      },{
        'name': 'FR4',
        'color': '#0000ff'
      },
    ];

    let offset = 0;
    _.each(region_info, (region, i) => {
      let size = this.props.regions[i] ;
      this.drawRegion(
        region.color,
        this.LEFT_PAD + middlePad,
        25,
        this.CHAR_SPACE,
        offset,
        offset + size - .4,
        region.name);
      offset += size;
    });
  }

  render() {
    return (
      <div className="slideWrap">
        <span className="scroller">
          <canvas id="seq-view">
            Your browser doesn't support HTML5! Please download a newer browser.
          </canvas>
        </span>
      </div>
    );
  }
}

export default SeqViewer;
