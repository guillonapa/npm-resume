#!/usr/bin/env node
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function wrapper() {
  /*
   * [X] Change experience to select and expand details for each position
   * [X] Add data to resume.json
   * [X] Write tests to verify that each of the main sections of the resume are named as expected
   * [X] Gruntify project
   * [X] Lintify whole project
   * [X] Transpile code to ES5
   * [ ] Style it correctly
   * [ ] Publish NPM package
   */
  var inquirer = require("inquirer");

  var chalk = require("chalk");

  var response = chalk.bold.green;
  var highlight = chalk.bold.blue;

  var resume = require("./lib/resume");

  var constants = require("./lib/constants");

  var PREFIX = "   ";
  var INDENT = "   "; // names for prompts

  var INITIAL_ANSWER = "initialAnswer";
  var RESUME_OPTIONS = "resumeOptions";
  var SKILLS_ANSWER = "skillsAnswer";
  var EXPERIENCE_ANSWER = "experienceAnswer"; // additional prompts options

  var EXIT = "Exit";
  var BACK_TO_RESUME = "Back to resume";
  var ALL = "All";
  /*** Prompts ***/

  var initialPrompt = {
    type: "confirm",
    name: INITIAL_ANSWER,
    message: "Continue?",
    "default": true
  };
  var resumePrompts = {
    type: "list",
    name: RESUME_OPTIONS,
    message: "Choose a section",
    choices: [].concat(_toConsumableArray(Object.keys(resume)), [EXIT])
  };
  var skillsPrompts = {
    type: "list",
    name: SKILLS_ANSWER,
    message: "Select a subcategory",
    choices: [BACK_TO_RESUME, ALL].concat(_toConsumableArray(Object.keys(resume[constants.SKILLS])))
  };
  var experiencePrompt = {
    type: "list",
    name: EXPERIENCE_ANSWER,
    message: "Select an entry for further details",
    choices: [BACK_TO_RESUME, ALL].concat(_toConsumableArray(Object.keys(resume[constants.EXPERIENCE])))
  };
  /*** Helper Methods ***/

  function printAll(option) {
    resume["".concat(option)].forEach(function (info) {
      console.log(response("".concat(INDENT).concat(info)));
    });
    console.log();
    resumeHandler();
  }

  function printAllFromSubObject(object, key, highlightFirstRow) {
    object[key].forEach(function (skill) {
      var str = "".concat(INDENT).concat(skill);

      if (highlightFirstRow) {
        highlightFirstRow = false;
        console.log(highlight(str));
      } else {
        console.log(response(str));
      }
    });
    console.log();
  }
  /*** Handlers ***/


  function normalSectionHandler(option, emoji) {
    console.log(highlight("\n".concat(PREFIX).concat(option, "  ").concat(emoji, "\n")));
    printAll(option);
  }

  function skillsHandler(option, emoji) {
    inquirer.prompt(skillsPrompts).then(function (innerAnswer) {
      var whatSkills = innerAnswer[SKILLS_ANSWER];

      if (whatSkills == BACK_TO_RESUME) {
        resumeHandler();
      } else if (whatSkills == ALL) {
        console.log(highlight("\n".concat(PREFIX, "Skills ").concat(emoji, "\n")));
        Object.keys(resume[option]).forEach(function (skillKey) {
          console.log(highlight("".concat(INDENT).concat(skillKey)));
          printAllFromSubObject(resume[option], skillKey, false);
        });
        skillsHandler(option, emoji);
      } else {
        console.log(highlight("\n".concat(PREFIX, "Skills ").concat(emoji, "\n\n").concat(INDENT).concat(whatSkills)));
        printAllFromSubObject(resume[option], whatSkills, false);
        skillsHandler(option, emoji);
      }
    });
  }

  function experienceHandler(option, emoji) {
    inquirer.prompt(experiencePrompt).then(function (answer) {
      var whatExperience = answer[EXPERIENCE_ANSWER];

      if (whatExperience == BACK_TO_RESUME) {
        resumeHandler();
      } else if (whatExperience == ALL) {
        console.log(highlight("\n".concat(PREFIX, "Experience ").concat(emoji, "\n")));
        Object.keys(resume[option]).forEach(function (experienceKey) {
          console.log(highlight("".concat(INDENT).concat(experienceKey)));
          printAllFromSubObject(resume[option], experienceKey, true);
        });
        experienceHandler(option, emoji);
      } else {
        console.log(highlight("\n".concat(PREFIX, "Experience ").concat(emoji, "\n\n").concat(INDENT).concat(whatExperience)));
        printAllFromSubObject(resume[option], whatExperience, true);
        experienceHandler(option, emoji);
      }
    });
  }

  function resumeHandler() {
    inquirer.prompt(resumePrompts).then(function (answer) {
      var option = answer[RESUME_OPTIONS];

      if (option == EXIT) {
        console.log(highlight("\n".concat(INDENT, "\uD83D\uDC4B  Cheers!\n")));
        return;
      } // handle section


      if (option == constants.SKILLS) {
        skillsHandler(option, "🔧");
      } else if (option == constants.EDUCATION) {
        normalSectionHandler(option, "🤓");
      } else if (option == constants.RELEVANT_COURSES) {
        normalSectionHandler(option, "🎓");
      } else if (option == constants.EXPERIENCE) {
        experienceHandler(option, "💪");
      } else if (option == constants.LEADERSHIP_AND_ACTIVITIES) {
        normalSectionHandler(option, "🤺");
      } else if (option == constants.HONORS_AND_AWARDS) {
        normalSectionHandler(option, "🏆");
      } else if (option == constants.SCHOLARSHIPS_AND_FELLOWSHIPS) {
        normalSectionHandler(option, "📜");
      } else if (option == constants.PRESENTATIONS_AND_PUBLICATIONS) {
        normalSectionHandler(option, "📊");
      } else if (option == constants.PROJECTS) {
        normalSectionHandler(option, "🤖");
      } else if (option == constants.LINKS_AND_CONTACT) {
        normalSectionHandler(option, "🤝");
      }
    });
  }
  /*** Entry point ***/


  function main() {
    console.log("\nHello, my name is ".concat(highlight("Guillermo Narvaez-Paliza"), " and welcome to my resume.\n"));
    inquirer.prompt(initialPrompt).then(function (answer) {
      if (!answer[INITIAL_ANSWER]) {
        return;
      }

      resumeHandler();
    });
  }

  main();
})();
