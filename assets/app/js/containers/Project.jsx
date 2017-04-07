import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import Perf from 'react-addons-perf';

import * as Actions from '../actions/ReduxTaskActions';
import ProjectMilestoneView from './ProjectMilestoneView.jsx';
import ProjectFileView from './ProjectFileView.jsx';
import ProjectNewsfeedView from './ProjectNewsfeedView.jsx';
import ProjectSettingView from './ProjectSettingView.jsx';
import _404 from '../components/Common/_404.jsx';
import { getCurrentTab, getProjectRoot } from '../utils/general';
import { getCurrentProject, getProjectActiveUsers, getProjectPendingUsers } from '../selector';
import * as AppConstants from '../AppConstants';
import ProjectMessageView from '../containers/ProjectMessageView.jsx';
import myTheme from '../myTheme.js';

const styles = {
  tabItemContainer: {
    height: 36,
  },
  tabButton: {
    height: 36,
    fontSize: 15,
  },
  tab: {
  },
  tabTemplate: {
    height: '100%',
  },
  tabs: {
    height: '',
  },
  projectTitleContanier: {
    textAlign: 'center',
    backgroundColor: myTheme.palette.primary1Color,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
};
class Project extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.changeTabToMilestone = this.changeTab.bind(this, AppConstants.PATH.milestones);
    this.changeTabToFile = this.changeTab.bind(this, AppConstants.PATH.files);
    this.changeTabToDiscussion = this.changeTab.bind(this, AppConstants.PATH.discussions);
    this.changeTabToNewsfeed = this.changeTab.bind(this, AppConstants.PATH.newsfeed);
    this.changeTabToSetting = this.changeTab.bind(this, AppConstants.PATH.settings);
  }

  componentDidUpdate() {
    // Perf.stop();
    // Perf.printInclusive();
    // Perf.printWasted();
  }

  changeTab(newTab) {
    // Perf.start();
    browserHistory.push(`${getProjectRoot()}/${newTab}`);
  }
  render() {
    const { app, actions, activeUsers, pendingUsers, currentProject } = this.props;
    const currentProjectId = currentProject.id;
    if (!currentProject) {
      return <_404 />;
    }

    // Set the active tab
    let currentTab = getCurrentTab();
    if (currentTab === '') {
      // default tab
      currentTab = AppConstants.PATH.milestones;
    }

    // let repoName = currentProject.github_repo_name
    // let repoOwner = currentProject.github_repo_owner
    // let repoSet = repoName && repoOwner

    return (
      <div className="main-content">
        <Tabs
          style={styles.tabs}
          value={currentTab}
          contentContainerClassName="full-height"
          className="full-height"
          tabTemplateStyle={styles.tabTemplate}
          tabItemContainerStyle={styles.tabItemContainer}
        >
          <Tab
            buttonStyle={styles.tabButton}
            label="Milestones"
            value={AppConstants.PATH.milestones}
            onActive={this.changeTabToMilestone}
          >
            <ProjectMilestoneView
              projectId={currentProjectId}
              users={activeUsers}
              actions={actions}
            />
          </Tab>
          <Tab
            buttonStyle={styles.tabButton}
            label="Files"
            value={AppConstants.PATH.files}
            onActive={this.changeTabToFile}
          >
            <ProjectFileView
              project={currentProject}
              actions={actions}
              app={app}
            />
          </Tab>
          <Tab
            buttonStyle={styles.tabButton}
            label="Discussions"
            value={AppConstants.PATH.discussions}
            onActive={this.changeTabToDiscussion}
          >
            <ProjectMessageView
              showMilestoneSelector
            />
          </Tab>
          <Tab
            buttonStyle={styles.tabButton}
            label="Newsfeed"
            value={AppConstants.PATH.newsfeed}
            onActive={this.changeTabToNewsfeed}
          >
            <ProjectNewsfeedView
              users={activeUsers}
            />
          </Tab>
          <Tab
            buttonStyle={styles.tabButton}
            label="Settings"
            value={AppConstants.PATH.settings}
            onActive={this.changeTabToSetting}
          >
            <ProjectSettingView
              project={currentProject}
              pendingUsers={pendingUsers}
              allActiveUsers={activeUsers}
              actions={actions}
              app={app}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Project.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  currentProject: PropTypes.object.isRequired,
  activeUsers: PropTypes.array.isRequired,
  pendingUsers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProject: getCurrentProject(state),
  activeUsers: getProjectActiveUsers(state),
  pendingUsers: getProjectPendingUsers(state),
  app: state.app,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
