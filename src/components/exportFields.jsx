import React from 'react';

export default class ExportFields extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: []
    };
  }

  toggle = (e) => {
    let selected = this.state.selected.slice();
    if (e.target.checked) {
      selected = _.union(selected, [e.target.value]);
    } else {
      _.remove(selected, (s) => s === e.target.value);
    }

    this.setState({
      selected
    });
    this.props.onFieldChange(selected);
  }

  toggleAll = (on) => {
    if (on) {
      var selected = _.pluck(this.props.fields, 'header');
    } else {
      var selected = _.pluck(_.filter(this.props.fields, 'force'), 'header');
    }
    this.setState({
      selected
    });
    this.props.onFieldChange(selected);
  }

  render() {
    return (
			<table className="ui compact celled definition table">
				<thead>
					<tr>
						<th></th>
						<th>Header</th>
						<th>Name</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
        {_.map(this.props.fields, (field) => {
          return (
            <tr key={field.header}>
              <td>
                <div className="ui fitted checkbox">
                  <input type="checkbox"
                         value={field.header}
                         onChange={this.toggle}
                         checked={_.includes(this.state.selected, field.header) || field.force}
                         disabled={field.force}
                  />
                  <label></label>
                </div>
              </td>
              <td className="text-mono">{field.header}</td>
              <td>{field.name}</td>
              <td>{field.desc}</td>
            </tr>
          );
        })}
				</tbody>
				<tfoot className="full-width">
					<tr>
						<th></th>
						<th colSpan="4">
              {this.props.exportButton}
							<div className="ui small button" onClick={this.toggleAll.bind(this, true)}>
                Check All
							</div>
							<div className="ui small button" onClick={this.toggleAll.bind(this, false)}>
                Uncheck All
							</div>
						</th>
					</tr>
				</tfoot>
      </table>
    );
  }
}
