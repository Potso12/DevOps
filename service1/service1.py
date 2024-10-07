from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import json
import shutil
import subprocess
import os
import datetime



def get_ps_output():
    result = subprocess.run(['ps', 'ax'], stdout=subprocess.PIPE, text=True)
    processes = result.stdout.split('\n')
    processes.pop()
    return processes


def get_process_start_time(pid):
    result = subprocess.run(['ps', '-p', str(pid), '-o', 'lstart='], stdout=subprocess.PIPE, text=True)
    start_time_str = result.stdout.strip()
    time_now = datetime.datetime.now()
    start_time = datetime.datetime.strptime(start_time_str, '%a %b %d %H:%M:%S %Y')


    time_difference = time_now - start_time
    hours, minutes, seconds = str(time_difference).split('.')[0].split(':')

    return hours + " Hours " + minutes + " Minutes " + seconds + " seconds"


def get_disk_usage(path='/'):
    usage = shutil.disk_usage(path)
    return f"{usage.free / (1024**3):.2f} G"


def get_ip_adress():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return ip_address



class myHTTPhandler(BaseHTTPRequestHandler):
    def do_GET(self):

        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        service_info = { 
            "ipAdress": get_ip_adress(),
            "runningProcesses": get_ps_output(),
            "disckSpace": get_disk_usage(),
            "timeSinceLastBoot": get_process_start_time(os.getpid())
 
            }
        
        as_json = json.dumps(service_info)
        self.wfile.write(as_json.encode('utf-8'))



def run(server_class=HTTPServer, handler_class=myHTTPhandler, port=8200):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Server running on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()