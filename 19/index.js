const Parser = require("../common/parser.js");

class Rule {
  constructor(raw) {
    if (raw.length === 1 || raw.indexOf(":") === -1) {
      this.condition = "N/A";
      this.accept = raw === "A";
      this.isValid = (_) => raw;
    }
    else {
      const parts = raw.split(":");
      const target = parts[1];
      const condition = parts[0][1];
      const prop = parts[0][0];
      const value = parseInt(parts[0].substring(2));

      this.condition = condition;
      this.value = value;

      this.isValid = (part) => {
        const v = part[prop];
        switch (condition) {
          case ">":
            if (v > value && target.length === 1) return target;
            return v > value ? target : "NEXT";
          case "<":
            if (v < value && target.length === 1) return target;
            return v < value ? target : "NEXT";
          default:
            throw new Error("Unknown condition: " + condition);
        }
      }
    }
  }

  validate(part) {
    return this.isValid(part);
  }
}


module.exports = class Day {
  static run() {

    const data = Parser.readRaw(__dirname, true).split("\n");

    const workflowMap = {};
    const parts = [];
    const parseRule = (raw) => {
      return new Rule(raw);
    }

    const runWorkflow = (workflow, part) => {
      for (let i = 0; i < workflow.rules.length; i++) {
        const rule = workflow.rules[i];
        const result = rule.validate(part);
        if (result !== "NEXT") return result;
      }
    }

    const parseWorkflow = (line) => {
      const s1 = line.split("{");
      const name = s1[0];
      const s2 = s1[1].replace("}", "").replace("\r", "").split(",");

      const rules = s2.map((raw) => parseRule(raw));
      const wf = {
        name, rules
      }

      return wf;
    }

    const parsePart = (line) => {
      const rawJson = line
        .replaceAll("=", ":")
        .replace("\r", "")
        .replace("x", "\"x\"")
        .replace("m", "\"m\"")
        .replace("a", "\"a\"")
        .replace("s", "\"s\"");
      return JSON.parse(rawJson);
    }

    let parsingWorkflows = true;
    data.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === "") {
        parsingWorkflows = false;
      }

      if (parsingWorkflows && trimmed != "") {
        const wf = parseWorkflow(line);
        workflowMap[wf.name] = wf;
      }
      else if (trimmed != "") {
        parts.push(parsePart(trimmed));
      }
    });

    const evaluatePart = (part) => {
      let currentWf = workflowMap[startKey];
      let r = null;
      do {
        r = runWorkflow(currentWf, part);
        if (r && r.length > 1) {
          currentWf = workflowMap[r];
        }
      } while (r !== 'A' && r !== 'R')

      if (r === 'A') {
        console.log("Accepted", part);
        return true;
      }
      else {
        console.log("Rejected", part);
        return false;
      }
    }


    const partOne = () => {
      const totalSum = parts.filter((part) => evaluatePart(part)).map((part) => part.x + part.m + part.a + part.s).reduce((a, b) => a + b);;
      console.log("Part 1", totalSum);
    }

    const partTwo = () => {
      let accepted = 0;
      let rejected = 0;
      console.log("Part 2 LAB");
      for (let x = 1; x <= 10; x++) {
        for (let y = 1; y <= 10; y++) {
          if (evaluatePart({ x, y })) accepted++;
          else rejected++;
        }
      }
      console.log("Accepted", accepted);
      console.log("Rejected", rejected);
    }

    const startKey = "aa";
    //partOne();
    partTwo();


  }
};
