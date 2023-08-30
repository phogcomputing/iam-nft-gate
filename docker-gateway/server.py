from flask import Flask, request, jsonify
import socket
import os

app = Flask(__name__)

def get_free_tcp_port():
    tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    tcp.bind(('', 0))
    addr, port = tcp.getsockname()
    tcp.close()
    return port

@app.route('/', methods=['GET', 'POST'])
def add_message():
    #content = request.json
    port = get_free_tcp_port();
    address = request.args.get('signer')
    print("port: {} address: {}".format(port,address))
    os.system("docker run  --rm --name {}  --net host --env BACALHAU_ENVIRONMENT=production -u root -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp ghcr.io/bacalhau-project/bacalhau:latest serve --ipfs-connect /dns4/localhost/tcp/5001 --node-type compute --swarm-port {} --labels \"owner={}\" &".format(address,port,address))
    print("docker run  --rm --name {}  --net host --env BACALHAU_ENVIRONMENT=production -u root -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp ghcr.io/bacalhau-project/bacalhau:latest serve --ipfs-connect /dns4/localhost/tcp/5001 --node-type compute --swarm-port {} --labels \"owner={}\" &".format(address,port,address))
    return jsonify({"port": port})

if __name__ == '__main__':
    app.run(host= '0.0.0.0',port=3000,debug=True)
