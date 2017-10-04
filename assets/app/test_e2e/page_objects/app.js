var config = require('config');

/* eslint-disable no-unused-expressions */
function addProject(projectName) {
  this.expect.element('@addProjectBtn').to.be.visible;
  this.click('@addProjectBtn').api.pause(200);
  this.expect.element('@projectNameInput').to.be.visible;
  this.setValue('@projectNameInput', projectName);
  this.click('@addProjectSubmitBtn').api.pause(1000);
  this.expect.element(`#project-${projectName}`).to.be.visible;
  return this;
}

function addMilestone(milestoneName, milestoneDate) {
  this.click('@addMilestoneBtn').api.pause(500);
  this.expect.element('@addMilestoneNameInput').to.be.visible;
  this.setValue('@addMilestoneNameInput', milestoneName);
  this.setValue('@addMilestoneDatepicker', milestoneDate);
  this.click('@addMilestoneSubmitBtn').api.pause(500);
  this.expect.element(`#milestone-${milestoneName}`).to.be.visible;
  return this;
}

const projectCommands = {
  addProject,
  addMilestone,
};

module.exports = {
  url: 'http://localhost:8080/',
  commands: [projectCommands],
  elements: {
    loginBtn: '.btn.btn-social.btn-google',
    systemSnackbar: '.system-snackbar',
    systemSnackbarMessage: '.system-snackbar > div > div > span',

    // Projects
    addProjectBtn: '.add-project-icon',
    projectNameInput: 'input[name="Project name"]',
    addProjectSubmitBtn: '.add-project-modal-actions > button:nth-child(2)',
    milestonesTab: '.project-milestones-tab',
    filesTab: '.project-files-tab',
    discussionsTab: '.project-discussions-tab',
    newsfeedTab: '.project-newsfeed-tab',
    settingsTab: '.project-settings-tab',
    emptyMilestonesMessage: '.task-list > .no-items',
    renameProjectInput: '.rename-project-input',
    renameProjectBtn: '.rename-project-btn',

    // Milestones
    addMilestoneBtn: '.add-milestone-btn',
    addMilestoneNameInput: '.add-milestone-name-input > input',
    addMilestoneDatepicker: '.add-milestone-datepicker input',
    addMilestoneSubmitBtn: '.add-milestone-modal-actions > button:nth-child(2)',

    // Tasks
    addTaskBtn: '.add-task-btn',
    addTaskSubmitBtn: '.add-task-submit-btn',
    addTaskNameInput: '.add-task-name-input textarea[name="Task name"]',
    addTaskMilestoneSelect: '.add-task-milestone-select',
    addTaskAssigneeSelect: '.add-task-assignee-select',
  },
};