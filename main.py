from flask import Flask, render_template, request, json
import socket
import detector.recognization as detector
app = Flask(__name__)

ip = socket.gethostbyname(socket.gethostname())


@app.route("/")
def main():
    return render_template('program.html')


@app.route("/api/recognize", methods=['POST'])
def recognize():
    imageString = json.loads(request.data)['code']
    # print(imageString)
    name = detector.recognize(imageString)
    print(name)
    res = {'name': name}
    return json.dumps(res)


if __name__ == "__main__":
    app.run(host=ip, debug=True, port=1997)
