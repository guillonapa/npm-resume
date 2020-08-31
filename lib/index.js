#!/usr/bin/env node
"use strict";

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
    const highlight = chalk.bold.blue;

    const resume = require("./lib/resume");
    const constants = require("./lib/constants");

    const PREFIX = "   ";
    const INDENT = "   ";

    // names for prompts
    const INITIAL_ANSWER = "initialAnswer";
    const RESUME_OPTIONS = "resumeOptions";
    const SKILLS_ANSWER = "skillsAnswer";
    const EXPERIENCE_ANSWER = "experienceAnswer";

    // additional prompts options
    const EXIT = "Exit";
    const BACK_TO_RESUME = "Back to resume";
    const ALL = "All";

    /*** Prompts ***/

    const initialPrompt = {
        type: "confirm",
        name: INITIAL_ANSWER,
        message: "Continue?",
        default: true
    };

    var resumePrompts = {
        type: "list",
        name: RESUME_OPTIONS,
        message: "Choose a section",
        choices: [...Object.keys(resume), EXIT]
    };

    const skillsPrompts = {
        type: "list",
        name: SKILLS_ANSWER,
        message: "Select a subcategory",
        choices: [BACK_TO_RESUME, ALL, ...Object.keys(resume[constants.SKILLS])]
    };

    const experiencePrompt = {
        type: "list",
        name: EXPERIENCE_ANSWER,
        message: "Select an entry for further details",
        choices: [BACK_TO_RESUME, ALL, ...Object.keys(resume[constants.EXPERIENCE])]
    };

    /*** Helper Methods ***/

    function printAll(option) {
        resume[`${option}`].forEach(info => {
            console.log(response(`${INDENT}${info}`));
        });
        console.log();
        resumeHandler();
    }

    function printAllFromSubObject(object, key, highlightFirstRow) {
        object[key].forEach(skill => {
            let str = `${INDENT}${skill}`;
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
        console.log(highlight(`\n${PREFIX}${option}  ${emoji}\n`));
        printAll(option);
    }

    function skillsHandler(option, emoji) {
        inquirer.prompt(skillsPrompts).then(innerAnswer => {
            const whatSkills = innerAnswer[SKILLS_ANSWER];
            if (whatSkills == BACK_TO_RESUME) {
                resumeHandler();
            } else if (whatSkills == ALL) {
                console.log(highlight(`\n${PREFIX}Skills ${emoji}\n`));
                Object.keys(resume[option]).forEach(skillKey => {
                    console.log(highlight(`${INDENT}${skillKey}`));
                    printAllFromSubObject(resume[option], skillKey, false);    
                });
                skillsHandler(option, emoji);
            } else  {
                console.log(highlight(`\n${PREFIX}Skills ${emoji}\n\n${INDENT}${whatSkills}`));
                printAllFromSubObject(resume[option], whatSkills, false);
                skillsHandler(option, emoji);
            }
        });
    }

    function experienceHandler(option, emoji) {
        inquirer.prompt(experiencePrompt).then(answer => {
            const whatExperience = answer[EXPERIENCE_ANSWER];
            if (whatExperience == BACK_TO_RESUME) {
                resumeHandler();
            } else if (whatExperience == ALL) {
                console.log(highlight(`\n${PREFIX}Experience ${emoji}\n`));
                Object.keys(resume[option]).forEach(experienceKey => {
                    console.log(highlight(`${INDENT}${experienceKey}`));
                    printAllFromSubObject(resume[option], experienceKey, true);    
                });
                experienceHandler(option, emoji);
            } else {
                console.log(highlight(`\n${PREFIX}Experience ${emoji}\n\n${INDENT}${whatExperience}`));
                printAllFromSubObject(resume[option], whatExperience, true);
                experienceHandler(option, emoji);
            }
        });
    }

    function resumeHandler() {
        inquirer.prompt(resumePrompts).then(answer => {
            const option = answer[RESUME_OPTIONS];
            if (option == EXIT) {
                console.log(highlight(`\n${INDENT}👋  Cheers!\n`));
                return;
            }
            // handle section
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
        console.log(`\nHello, my name is ${highlight("Guillermo Narvaez-Paliza")} and welcome to my resume.\n`);
        inquirer.prompt(initialPrompt).then(answer => {
            if (!answer[INITIAL_ANSWER]) {
                return;
            }
            resumeHandler();
        });
    }

    main();

}());


