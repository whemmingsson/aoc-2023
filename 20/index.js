const Parser = require("../common/parser.js");
const regex = require("../common/regexUtils.js");

const LOGGING = false;

class Module {
    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.targetModules = [];
        this.targetModuleNames = [];
        this.value = value || false;
    }

    addTargetModuleName(moduleName) {
        this.targetModuleNames.push(moduleName);
    }

    addTargetModuleNames(moduleNames) {
        this.targetModuleNames.push(...moduleNames);
    }

    addTargetModule(module) {
        this.targetModules.push(module);
    }

    addTargetModules(modules) {
        this.targetModules.push(...modules);
    }

    recieveSignal(value, from) {
        this.value = value;
    }

    log(value, to) {
        if (!LOGGING) return;
        let strValue = "";
        if (value) strValue = "-high";
        else strValue = "-low";
        console.log(`${this.name} ${strValue}-> ${to}`);
    }
}

class FlipFlopModule extends Module {
    constructor(name) {
        super("%", name, false);
    }

    recieveSignal(pulse, from) {
        //console.log(` FlipFlop ${this.name} recieved signal ${pulse} from ${from}`);
        if (pulse === true) { return; }
        this.value = !this.value;
        this.targetModules.forEach((target) => {
            if (this.value === true) highSignalSent++;
            else lowSignalSent++;
            this.log(this.value, target.name);
            target.recieveSignal(this.value);
        });
    }
}

class BroadcasterModule extends Module {
    constructor(name) {
        super("broadcaster", name, false);
    }

    recieveSignal(value, _) {
        //console.log("Broadcaster recieved signal");
        this.targetModules.forEach((target) => {
            this.log(value, target.name);
            if (value === true) highSignalSent++;
            else lowSignalSent++;
            target.recieveSignal(value, this.name);
        });
    }
}

class ConjunctionModule extends Module {
    constructor(name) {
        super("&", name);
        this.memory = {};
    }

    recieveSignal(value, from) {
        //console.log(`  Conjunction ${this.name} recieved signal ${value} from ${from}`);
        this.memory[from] = value;

        if (Object.values(this.memory).every((x) => x === true)) {
            this.targetModules.forEach((target) => {
                this.log(false, target.name);
                lowSignalSent++;
                target.recieveSignal(false, this.name);
            });
        }
        else {
            this.targetModules.forEach((target) => {
                this.log(false, target.name);
                highSignalSent++;
                target.recieveSignal(true, this.name);
            });
        }
    }
}

let lowSignalSent = 0;
let highSignalSent = 0;

module.exports = class Day {
    static run() {
        const data = Parser.readRaw(__dirname, true).split("\n");

        const modules = [];
        const moduleMap = {};

        // Parse input
        let broadcaster;
        data.forEach((row) => {
            const parts = row.split("->").map((x) => x.trim());
            console.log(parts);

            let module;
            const moduleType = parts[0][0];
            const moduleName = parts[0].substring(1).trim();
            const targetModules = parts[1].split(",").map((x) => x.trim());
            if (parts[0] !== "broadcaster") {
                if (moduleType === "%") {
                    module = new FlipFlopModule(moduleName);
                }
                else if (moduleType === "&") {
                    module = new ConjunctionModule(moduleName);
                }
            }
            else {
                module = new BroadcasterModule("broadcaster");
                broadcaster = module;
            }

            module.addTargetModuleNames(targetModules);
            modules.push(module);
            moduleMap[moduleName] = module;

        });

        modules.forEach((module) => {
            module.addTargetModules(module.targetModuleNames.map((name) => moduleMap[name]).filter((x) => x !== undefined));
        })

        console.log(modules);

        const button = {
            push: () => {
                lowSignalSent++;
                broadcaster.recieveSignal(false, "button");
            }
        };

        for (let i = 0; i < 1000; i++) {
            button.push();
        }

        console.log(`Low signal sent: ${lowSignalSent}`);
        console.log(`High signal sent: ${highSignalSent}`);

        const factor = lowSignalSent * highSignalSent;
        console.log(`Factor: ${factor}`);

    }
};
