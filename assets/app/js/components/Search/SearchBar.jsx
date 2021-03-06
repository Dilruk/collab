import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import AutoComplete from 'material-ui/AutoComplete';

import Code from '../../icons/Code.jsx';
import myTheme from '../../myTheme.js';

const RATE_LIMIT_MS = 900;
const MIN_SEARCH_CHARS = 3;
const MAX_SEARCH_RESULTS = 6;

const propTypes = {
  actions: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  search: PropTypes.array.isRequired,
};
const styles = {
  hintStyle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
  },
  autoCompleteStyle: {
    color: 'white',
    width: '100%',
    maxWidth: 400,
  },
  listStyle: {
    width: '100%',
    minWidth: 300,
    fontSize: 10,
    overflowX: 'hidden',
  },
  textFieldStyle: {
    minWidth: 300,
    width: '100%',
    color: 'white',
    verticalAlign: 'top',
  },
  underlineFocusStyle: {
    borderWidth: 2,
    borderColor: 'white',
  },
  underlineStyle: {
    borderWidth: 1,
    borderColor: 'white',
  },
  menuStyle: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400,
  },
  menuItemStyle: {
    overflowX: 'auto',
    fontSize: 15,
    // color: myTheme.palette.primary1Color,
  },
};
/* global gapi window document localStorage */
class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      lastQueryTime: new Date().getTime(),
      lastQueryString: '',
      queryString: '',
    };
    this.newRequest = this.newRequest.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }
  executeQuery(queryString) {
    if (queryString.trim()) {
      this.props.actions.queryIntegrations(queryString);
      this.setState({
        lastQueryTime: new Date().getTime(),
        lastQueryString: queryString,
      });
    }
  }
  updateQuery(queryString) {
    this.setState({
      queryString,
    });
    if (queryString.length < MIN_SEARCH_CHARS) {
      return;
    }
    const elapsedTime = new Date().getTime() - this.state.lastQueryTime;
    if (elapsedTime < RATE_LIMIT_MS) {
      setTimeout(() => {
        if (this.state.queryString !== this.state.lastQueryString) {
          this.executeQuery(this.state.queryString);
        }
      }, RATE_LIMIT_MS);
    } else {
      this.executeQuery(queryString);
    }
  }
  newRequest() {
    if (this.state.queryString !== this.state.lastQueryString) {
      this.executeQuery(this.state.queryString);
    }
    this.setState({
      queryString: '',
    });
    browserHistory.push('/app/search');
  }

  goToResult(link, e) {
    e.preventDefault();
    window.open(link, '_newtab');
  }

  render() {
    let searchResults = null;
    if (this.props.search.length === 0 && this.state.queryString.length >= MIN_SEARCH_CHARS) {
      let text = 'Could not find any results';
      if (this.props.app.queriesInProgress) {
        text = 'Searching...';
      }
      searchResults = [{
        text: '',
        value: (
          <MenuItem
            style={styles.menuItemStyle}
            primaryText={text}
            disabled
          />
        ),
      }];
    } else {
      searchResults = this.props.search.map(result => {
        let avatar = <Avatar src={result.thumbnail} />;
        if (result.type === 'github') {
          avatar = (
            <Avatar
              icon={<Code style={{ margin: '0px' }} />}
            />
          );
        }
        return {
          text: result.primaryText,
          value: (
            <MenuItem
              hoverColor="red"
              style={styles.menuItemStyle}
              leftIcon={avatar}
              primaryText={result.primaryText}
              onTouchTap={this.goToResult.bind(this, result.link)}
            />
          ),
        };
      });
    }


    return (
      <AutoComplete
        hintText="Search Collab"
        filter={AutoComplete.noFilter}
        dataSource={searchResults}
        onUpdateInput={this.updateQuery}
        onNewRequest={this.newRequest}
        searchText={this.state.queryString}
        listStyle={styles.listStyle}
        textFieldStyle={styles.textFieldStyle}
        menuStyle={styles.menuStyle}
        style={styles.autoCompleteStyle}
        inputStyle={styles.textFieldStyle}
        underlineStyle={styles.underlineStyle}
        underlineFocusStyle={styles.underlineFocusStyle}
        hintStyle={styles.hintStyle}
        maxSearchResults={MAX_SEARCH_RESULTS}
      />
    );
  }
}
Header.propTypes = propTypes;
export default Header;
