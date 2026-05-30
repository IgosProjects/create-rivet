#!/usr/bin/env node

/*
    This file is licensed under the MIT license, the terms must be followed!
    Copyright(c) 2026 EyeDev
*/

// This is the file that NodeJS runs when you run "npm create @igosprojects/rivet"
// We need to prompt the user for some stuff, and clone the git repo

import readline from 'readline';
import fs from 'fs';
import degit from 'degit'; // Used to clone git repos
import path from 'path';

// Create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Asks the user a question in the terminal
function question(prompt: string, defaultValue = ''): Promise<string> {
    return new Promise((resolve) => {
        const defaultText = defaultValue ? ` (${defaultValue})` : '';
        rl.question(`${prompt}${defaultText}: `, (answer) => {
            resolve(answer || defaultValue);
        });
    });
}

async function main() {
    let ProjectName = process.argv[2];

    // If no project name was supplied, ask for it
    if (!ProjectName) {
        ProjectName = await question("Project name: ", "my-rivet-project");
    }

    let TargetPath;
    if (ProjectName == '.') {
        // If the project name is "." aka current directory. Set it to the folder name
        TargetPath = process.cwd(); // Set the path to the current directory
        ProjectName = path.basename(TargetPath); // Get the name of the folder
    } else {
        TargetPath = path.join(process.cwd(), ProjectName); // If not the current directory, use the one provided

        // Check if the directory allready exists
        if (fs.existsSync(TargetPath)) {
            console.error(`Folder ${ProjectName} allready exists!`);
            process.exit(1);
        }
    }
    
    console.log(`\nCreating ${ProjectName} in directory ${TargetPath}`);
        
        
    // Clone the template using degit
    const emitter = degit('IgosProjects/rivet-template', {
        cache: false,
        force: true
    });

    await emitter.clone(TargetPath); // Clone into the directory
    fs.rmSync(path.join(TargetPath, '.git'), { recursive: true, force: true }); // Remove .git folder
    
    console.log("\nCreated project!\n");
    console.log("Next steps:");

    // If its not the current directory, show the CD command
    if (ProjectName !== '.') {
        console.log(`  cd ${ProjectName}`);
    }

    console.log("   pnpm install");
    console.log("   pnpm run");
    console.log("   Then visit localhost:8080")

    rl.close();
}

main().catch(console.error);