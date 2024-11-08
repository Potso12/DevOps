const express = require('express');
const http = require('node:http');
const { exec } = require('child_process');
const util = require('util');
const ip = require('ip');
const checkDiskSpace = require('check-disk-space');
const process = require('process');
const sleep = require('sleep');



const execPromise = util.promisify(exec);

const app = express();

app.use((req, res, next) => {
  res.on('finish', () => {
    setTimeout(() => {
      console.log('Wait 10s')
    }, 10000)
  })
  next()
})


const getDisckSpace = async () => {
    try {
        const diskSpace = await checkDiskSpace('/');
        return `${(diskSpace.free / (1024**3)).toFixed(2)} G`;      
    } catch (error) {
        return "getting disckspace fialed";
    }
}

const getProcesses = async () => {
    try {
      const { stdout, stderr } = await execPromise('ps ax');
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }

      const processes = stdout.split('\n')
      processes.pop()
      return processes
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  const getProcessStartTime = async (pid) => {
    try {
      const { stdout } = await execPromise(`ps -p ${pid} -o lstart=`);
      const startTime = new Date(stdout.trim()).getTime();
      const now = Date.now()
      
      const upTimeInMilliseconds = now - startTime
      
      const Hours = `${Math.floor(upTimeInMilliseconds / (1000 * 60 * 60))} Hours `;
      const Minutes = `${Math.floor((upTimeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60))} Minutes `;
      const Seconds = `${Math.floor((upTimeInMilliseconds % (1000 * 60)) / 1000)} Seconds`;

      return Hours + Minutes + Seconds

    } catch (error) {
      console.error(`Error: ${error.message}`);
      return null;
    }
  };

app.get('/', async (request, response) => {
    
    console.log('New request')
    const disckSpace = await getDisckSpace()

    const processes = await getProcesses()

    const lastBoot = await getProcessStartTime(process.pid)


    let service2Info = {
        ipAdress: ip.address(),
        runningProcesses: processes,
        disckSpace: disckSpace,
        timeSinceLastBoot: lastBoot
    }


    try {
        let data = '';
        http.get('http://service2:8201', (res) => {

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const service1Info = JSON.parse(data);
                response.send({service1Info, service2Info})
                sleep.sleep(2)
            });

            request.on('error', (error) => {
                console.error('Error connecting to other server', error);
                response.status(500).json({ error: 'Error connecting to other server' });
            });
        })
    } catch (error) {
        console.error('Error connecting to other server', error);
        response.status(500).json({ error: 'Error connnecting to other server' });
    }
})

app.delete('/', async (req, res) => {
  try {
    // Set up options for the HTTP request
    const options = {
      hostname: 'service2',
      port: 8201,
      path: '/',
      method: 'DELETE'
    };

    // Wait for the response from the HTTP request to service2
    const data = await new Promise((resolve, reject) => {
      let data = '';
      const request = http.get(options, (response) => {
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          resolve(data); // Resolve the promise once the request completes
        });

        response.on('error', (err) => {
          reject(err); // Reject the promise if there is an error
        });
      });

      request.on('error', (err) => {
        reject(err); // Reject the promise if the request itself fails
      });
    });

    // Log the response from service2
    console.log('Service 2 removed:', data);

    // Send the HTTP response to the client after the request completes
    res.status(200).send('Request completed successfully');

    // Now, terminate the process if needed
    process.exit(0); // Be careful using this in a production environment
  } catch (error) {
    // Handle any error that occurred during the HTTP request or process
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(8199,() =>{
    console.log('Server is running on PORT 8199');
});