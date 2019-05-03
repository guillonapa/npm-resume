#!/usr/bin/env node
"use strict";

/*
 * [ ] Change experience to select and expand details for each position
 * [ ] Add data to resume.json
 * [ ] Lintify whole project
 * [ ] Transpile code to ES5
 * [ ] Publish NPM package
 */

var inquirer = require("inquirer");
var chalk = require("chalk");

var response = chalk.bold.green;
const highlight = chalk.bold.blue;

const resume = require("./resume.json");
const prompts = require("./prompts.json");

const INITIAL_YES = prompts["initialPrompts"]["yes"];
const INITIAL_NO = prompts["initialPrompts"]["no"];
const BACK_TO_RESUME = "Back to resume";

const initialPrompt = {
    type: "confirm",
    name: "initialAnswer",
    message: "Continue?",
    default: true
    // choices: [INITIAL_YES, INITIAL_NO]
}

var resumePrompts = {
  type: "list",
  name: "resumeOptions",
  message: "Choose a section",
  choices: [...Object.keys(resume), "Exit"]
};

const skillsPrompts = {
    type: "list",
    name: "skillsAnswer",
    message: "Select a subcategory",
    choices: ["All", ...Object.keys(resume["Skills"]), BACK_TO_RESUME]
}

// will print all the available elements in the array
function printSkills(object, key) {
    object[key].forEach(skill => {
        console.log(response(`   ${skill}`));
    });
    console.log();
}

function main() {
    console.log(`\nHello, my name is ${highlight("Guillermo Narvaez-Paliza")} and welcome to my resume.\n`);
    inquirer.prompt(initialPrompt).then(answer => {
        if (!answer.initialAnswer) {
            return;
        }
        // continue to show the resume options
        resumeHandler();
    });
}

function skillsHandler(option) {
    inquirer.prompt(skillsPrompts).then(innerAnswer => {
        const whatSkills = innerAnswer.skillsAnswer;
        if (whatSkills == BACK_TO_RESUME) {
            resumeHandler();
        } else if (whatSkills == "All") {
            console.log(highlight(`\n    >>> Skills 😎\n`));
            Object.keys(resume[option]).forEach(skillKey => {
                console.log(highlight(`    ${skillKey}`));
                printSkills(resume[option], skillKey);    
            });
            skillsHandler(option);
        } else  {
            console.log(highlight(`\n    >>> Skills [${whatSkills}] 😎\n`));
            printSkills(resume[option], whatSkills);
            skillsHandler(option);
        }
    });
}

function printAll(option) {
    resume[`${option}`].forEach(info => {
        console.log(response(`   ${info}`));
    });
    console.log();
    resumeHandler();
}

function resumeHandler() {
    // console.log();
    inquirer.prompt(resumePrompts).then(answer => {
        if (answer.resumeOptions == "Exit") {
            console.log(highlight("\n   👋  Cheers!\n"));
            return;
        }
        var option = answer.resumeOptions;
        if (option == "Skills") {
            skillsHandler(option);
        } else if (option == "Education") {
            console.log(highlight("\n    >>> Education 🤓\n"));
            printAll(option);
        } else if (option == "Relevant Courses") {
            console.log(highlight("\n    >>> Relevant Courses  🎓\n"));
            printAll(option);
        } else if (option == "Experience") {
            console.log(highlight("\n    >>> Experience 💪\n"));
            printAll(option);
        } else {
            printAll(option);
        }
    });
}

main();