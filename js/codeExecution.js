// Code execution functionality
function runCode(exampleId) {
    const codeTextarea = document.getElementById(exampleId + '-code');
    const outputDiv = document.getElementById(exampleId + '-output');
    
    if (!codeTextarea || !outputDiv) {
        console.error('Code textarea or output div not found for:', exampleId);
        return;
    }
    
    const code = codeTextarea.value;
    const outputContent = outputDiv.querySelector('.output-content');
    
    // Clear previous output
    outputContent.textContent = 'Running...';
    outputContent.className = 'output-content';
    
    // Simulate code execution
    setTimeout(() => {
        try {
            const result = executeSimulatedPython(code, exampleId);
            outputContent.textContent = result;
            outputContent.classList.add('success');
            
            // Mark section as completed when code is successfully run
            const sectionName = exampleId.split('-')[0];
            markSectionComplete(sectionName);
            
        } catch (error) {
            outputContent.textContent = 'Error: ' + error.message;
            outputContent.classList.add('error');
        }
    }, 500);
}

// Simulated Python execution
function executeSimulatedPython(code, exampleId) {
    try {
        // Remove comments and empty lines for processing
        const lines = code.split('\n').filter(line => 
            line.trim() && !line.trim().startsWith('#')
        );
        
        let output = '';
        let variables = {};
        
        // Process each line
        for (let line of lines) {
            line = line.trim();
            
            // Handle print statements
            if (line.startsWith('print(')) {
                const printContent = line.slice(6, -1); // Remove 'print(' and ')'
                output += evaluatePrintStatement(printContent, variables) + '\n';
            }
            // Handle variable assignments
            else if (line.includes(' = ') && !line.startsWith('def ') && !line.startsWith('class ')) {
                const [varName, value] = line.split(' = ');
                variables[varName.trim()] = evaluateValue(value.trim());
            }
            // Handle function definitions (simplified)
            else if (line.startsWith('def ')) {
                const funcName = line.split('(')[0].replace('def ', '');
                output += `Function '${funcName}' defined\n`;
            }
            // Handle class definitions (simplified)
            else if (line.startsWith('class ')) {
                const className = line.split(':')[0].replace('class ', '');
                output += `Class '${className}' defined\n`;
            }
        }
        
        // Special handling for specific examples
        const predefinedOutput = getPredefinedOutput(exampleId);
        if (predefinedOutput) {
            return predefinedOutput;
        }
        
        return output || 'Code executed successfully!';
        
    } catch (error) {
        throw new Error('Invalid Python syntax or unsupported operation');
    }
}

function evaluatePrintStatement(content, variables) {
    // Handle f-strings
    if (content.startsWith('f"') && content.endsWith('"')) {
        let result = content.slice(2, -1); // Remove f" and "
        // Replace variables in braces
        result = result.replace(/\{([^}]+)\}/g, (match, varName) => {
            if (variables[varName]) {
                return variables[varName];
            }
            return match;
        });
        return result;
    }
    
    // Handle regular strings
    if (content.startsWith('"') && content.endsWith('"')) {
        return content.slice(1, -1);
    }
    
    // Handle variables
    if (variables[content]) {
        return variables[content];
    }
    
    return content;
}

function evaluateValue(value) {
    // Handle strings
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    
    // Handle numbers
    if (!isNaN(value)) {
        return value.includes('.') ? parseFloat(value) : parseInt(value);
    }
    
    // Handle booleans
    if (value === 'True') return true;
    if (value === 'False') return false;
    
    return value;
}
