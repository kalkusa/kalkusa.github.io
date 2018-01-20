const fs = require('fs'), spawn = require('child_process').spawn;
console.log('Starting watching...');
var fsTimeout;
deployContainer();

fs.watch('.', {
    recursive: true
}, (e, file) => {
    if (!fsTimeout) {
        deployContainer();
        fsTimeout = setTimeout(function () { fsTimeout = null }, 3000)
    }
});

function deployContainer() {
    console.log('Deploying container...');
    let child = spawn("powershell.exe", [".\\dockerUpdate.ps1"]);
    child.on("exit", function () {
        console.log('Container has been deployed successfuly');
    });
    child.stdin.end();
}