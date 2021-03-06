import React, { Component } from 'react';
import { inject } from 'lib/Injector';
import classnames from 'classnames';

class BlockLinkFieldActions extends Component {
  constructor(props) {
    super(props);

    this.handleChangeValue = this.handleChangeValue.bind(this);
  }

  /**
   * @param {String} value
   * @returns {Object} One of props.actions.
   */
  getOptionByValue(value) {
    return this.props.actions.find(action => action.value === value);
  }

  /**
   * @param {Event} event
   * @returns {Promise|null}
   */
  handleChangeValue(event) {
    let promise = null;

    // Make sure a valid option has been selected.
    const option = this.getOptionByValue(event.target.value);
    if (typeof option === 'undefined') {
      return null;
    }

    if (typeof option.confirm === 'function') {
      promise = option.confirm()
        .then(() => option.callback())
        .catch((reason) => {
          // Suppress and catch errors for user-cancelled actions
          if (reason !== 'cancelled') {
            throw reason;
          }
        });
    } else {
      promise = option.callback() || Promise.resolve();
    }

    return promise;
  }

  render() {
    // eslint-disable-next-line arrow-body-style
    const children = this.props.actions.map((action) => {
      const className = classnames(
        'block-link-field__action',
        'btn',
        'btn-secondary',
        action.className || '',
      );

      return (<button
        type="button"
        className={className}
        key={action.value}
        onClick={this.handleChangeValue}
        value={action.value}
      >
        {action.label}
      </button>);
    }).filter(item => item);

    if (!children.length) {
      return null;
    }
    const { PopoverField } = this.props;

    return (
      <div className="block-link-field-actions fieldholder-small input-group">
        <PopoverField
          id={this.props.id}
          popoverClassName="block-link-field-actions__menu"
          className="btn-sm"
          buttonSize="md"
          data={{ placement: 'bottom' }}
          container={this.props.container}
        >
          {children}
        </PopoverField>
      </div>
    );
  }
}

BlockLinkFieldActions.propTypes = {
  id: React.PropTypes.string.isRequired,
  actions: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    destructive: React.PropTypes.bool,
    callback: React.PropTypes.func,
    canApply: React.PropTypes.func,
    confirm: React.PropTypes.func,
  })),
  PopoverField: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func]),
};

BlockLinkFieldActions.defaultProps = {
  id: '',
  actions: [],
  PopoverField: null,
};

export { BlockLinkFieldActions as Component };

export default inject(
  ['PopoverField'],
  (PopoverField) => ({ PopoverField }),
  () => 'BlockLinkFieldActions'
)(BlockLinkFieldActions);
