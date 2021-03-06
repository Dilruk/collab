import assign from 'object-assign';
import _ from 'lodash';
import * as AppConstants from '../AppConstants';
/*
Example state tree:

const projects = [
  {
    id: 'NJ-5My0Jg',
    content: 'FYP',
    creator: 'uid1',
    basic: ['uid2'],
    pending: ['user_who_was_invited'],
    milestones: ['mid1', 'mid2'],
    tasks: [],
    root_folder: 'folderId',
    directory_structure: [
      { name: 'upper level directory', id: 123 },
      { name: 'curr directory', id: 999 },
    ],
    files_loaded: true,
    github_repo_name: 'repoName',
    github_repo_owner: 'repoOwner',
  },
];
*/


const projects = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_PROJECTS:
      return action.projects;
    case AppConstants.CREATE_PROJECT:
      return [action.project, ...state];
    case AppConstants.DELETE_PROJECT:
      return state.filter(project => project.id !== action.id);
    case AppConstants.REPLACE_PROJECT_ID:
      return state.map(project => (
        project.id === action.original ? assign({}, project, { id: action.replacement }) : project
      ));
    case AppConstants.UPDATE_PROJECT:
      return state.map(project => (
        project.id === action.id ? assign({}, project, action.payload) : project
      ));
    case AppConstants.JOIN_PROJECT:
      return state.map(project => {
        if (project.id === action.id) {
          const pending = project.pending.filter(id => id !== action.user_id);
          const basic = [...project.basic, action.user_id];
          return assign({}, project, {
            pending,
            basic,
          });
        }
        return project;
      });
    case AppConstants.ADD_DIRECTORY:
      return state.map(project => {
        // avoid adding duplicate directory
        if (project.id === action.id && (_.findIndex(
          project.directory_structure, o => (o.id === action.directory.id))
        ) === -1) {
          return assign({}, project, {
            directory_structure: [...project.directory_structure, action.directory],
          });
        }
        return project;
      });
    case AppConstants.GO_TO_DIRECTORY:
      return state.map(project => {
        if (project.id === action.projectId) {
          const directoryStructure = project.directory_structure;
          const matchIndex = _.findLastIndex(project.directory_structure,
            dir => dir.id === action.dirId
          );
          if (matchIndex >= 0) {
            const newDirectoryStructure = directoryStructure.slice(0, matchIndex + 1);
            return assign({}, project, { directory_structure: newDirectoryStructure });
          }
        }
        return project;
      });
    case AppConstants.SET_DIRECTORY_AS_ROOT:
      return state.map(project => {
        if (project.id === action.projectId) {
          const updatedDirStructure = project.directory_structure.filter(dir =>
            dir.id === action.dirId
          );
          return assign({}, project, {
            root_folder: action.dirId,
            directory_structure: updatedDirStructure,
            folder_error: '',
          });
        }
        return project;
      });
    case AppConstants.SET_GITHUB_REPO:
      return state.map(project => {
        if (project.id === action.projectId) {
          return assign({}, project, {
            github_repo_name: action.repoName,
            github_repo_owner: action.repoOwner,
          });
        }
        return project;
      });
    default:
      return state;
  }
};

export default projects;
