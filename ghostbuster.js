In a Windows environment, you can use the netstat -ano command to get a list of all active network connections along with the PIDs. However, the netstat command does not provide the name of the service or program. You can use tasklist to fetch the program names associated with the PIDs.
This script first executes netstat -ano to get a list of all active network connections. Then, it executes tasklist to get a list of all running tasks. Finally, it parses the output of these commands to extract and print the protocol, local IP, port, PID, and program name for each listening connection.

Please note that this script might not work correctly if there are spaces in the process names, and it also might not correctly handle processes that have multiple instances running under the same PID. You might need to adjust the parsing code to handle these edge cases.

// netstat windows 
const { exec } = require('child_process');

// Execute netstat command
exec('netstat -ano', (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }

    // Fetch all processes
    exec('tasklist', (errTasklist, stdoutTasklist) => {
        if (errTasklist) {
            console.error(`exec error: ${errTasklist}`);
            return;
        }

        // Split output into lines
        const lines = stdout.split('\n');

        lines.forEach(line => {
            // Extract columns (Protocol, Local Address, Foreign Address, State, PID)
            const parts = line.trim().split(/\s+/);
            if (parts.length === 5) {
                const [protocol, localAddress, foreignAddress, state, pid] = parts;

                if (state === 'LISTENING') {
                    const [ip, port] = localAddress.split(':');

                    // Find the process in the tasklist
                    const processLine = stdoutTasklist.split('\n').find(l => l.includes(pid));
                    const processName = processLine ? processLine.split(/\s+/)[0] : 'Unknown';

                    console.log(`Protocol: ${protocol}`);
                    console.log(`Local IP: ${ip}`);
                    console.log(`Port: ${port}`);
                    console.log(`PID: ${pid}`);
                    console.log(`Program: ${processName}`);
                    console.log('-------------------');
                }
            }
        });
    });
});



write a node js netstat app to  list open ports and name the services and the pids running on them

To build an application that lists open ports along with the services and PIDs running on them, you can use the netstat command line tool with the help of the child_process module in Node.js.

Note that the command to find this information can be different depending on the OS you are using. The below example uses a command that works on Unix-based systems including Linux and MacOS.

Here's a simple example of a Node.js application that executes netstat and parses the output:


const { exec } = require('child_process');

exec('netstat -tuln | grep LISTEN', (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }

    // Parse the output
    const lines = stdout.split('\n');
    lines.forEach(line => {
        const parts = line.split(/\s+/).filter(String);
        if (parts.length >= 7) {
            const protocol = parts[0];
            const pid = parts[6].split('/')[0];
            const program = parts[6].split('/')[1];
            const address = parts[3];
            const [ip, port] = address.split(':');

            console.log(`Protocol: ${protocol}`);
            console.log(`PID: ${pid}`);
            console.log(`Program: ${program}`);
            console.log(`IP: ${ip}`);
            console.log(`Port: ${port}`);
            console.log('-----');
        }
    });
});
This script runs netstat -tuln | grep LISTEN to get a list of all listening sockets, and then parses the output. The parsed output includes the protocol, PID, program name, IP, and port for each socket.

This will work on Unix-like systems such as Linux and macOS. If you are on a Windows machine, you'll need to use the netstat -ano command instead, and adjust the parsing code accordingly.

Please note that netstat might not provide the exact name of the service running on the port, it will provide the name of the program that is executing the service.

Also, this script assumes that grep is available, which is true on Unix-like systems but not on Windows.
