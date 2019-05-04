const chai = require("chai");
const resume = require("../lib/resume");
const constants = require("../lib/constants");

const check = (key) => {
    chai.assert(typeof key === "string" || key instanceof String, `The value [${key}] is not a String -- Got ${typeof key}`);
    chai.assert(resume[key] != null, `${key} does not exist in resume.json`);
};

describe("Testing correlation between resume.json and constants.js...", () => {

    it(`Checking number of constants equal number of objects in resume.json`, () => {
        const keysInResume = Object.keys(resume).length;
        const keysInConstants = Object.keys(constants).length;
        chai.assert(keysInResume === keysInConstants, `The number of keys in resume.json (${keysInResume}) does not equal the number of constants in constants.js (${keysInConstants})`);
    });

    const education = constants.EDUCATION;
    it(`Checking if "${education}" is a key in resume.json`, () => {
        check(education);
    });

    const relevantCourses = constants.RELEVANT_COURSES;
    it(`Checking if "${relevantCourses}" is a key in resume.json`, ()=> {
        check(relevantCourses);
    });

    const skills = constants.SKILLS;
    it(`Checking if "${skills}" is a key in resume.json`, ()=> {
        check(skills);
    });

    const experience = constants.EXPERIENCE;
    it(`Checking if "${experience}" is a key in resume.json`, ()=> {
        check(experience);
    });

    const leadership = constants.LEADERSHIP_AND_ACTIVITIES;
    it(`Checking if "${leadership}" is a key in resume.json`, ()=> {
        check(leadership);
    });

    const honors = constants.HONORS_AND_AWARDS;
    it(`Checking if "${honors}" is a key in resume.json`, ()=> {
        check(honors);
    });

    const scholarships = constants.SCHOLARSHIPS_AND_FELLOWSHIPS;
    it(`Checking if "${scholarships}" is a key in resume.json`, ()=> {
        check(scholarships);
    });

    const presentations = constants.PRESENTATIONS_AND_PUBLICATIONS;
    it(`Checking if "${presentations}" is a key in resume.json`, ()=> {
        check(presentations);
    });

    const projects = constants.PROJECTS;
    it(`Checking if "${projects}" is a key in resume.json`, ()=> {
        check(projects);
    });

    const contact = constants.LINKS_AND_CONTACT;
    it(`Checking if "${contact}" is a key in resume.json`, ()=> {
        check(contact);
    });
});