import numpy as np
import argparse
import imutils
import pickle
import cv2
import os
import base64
from PIL import Image
from io import BytesIO

print("Face recognizing....")

path = "detector/"

protoPath = path+'face_detection_model/deploy.prototxt'
modelPath = path+'face_detection_model/res10_300x300_ssd_iter_140000.caffemodel'
embeddingPath = path+'openface_nn4.small2.v1.t7'

detector = cv2.dnn.readNetFromCaffe(protoPath, modelPath)
embedder = cv2.dnn.readNetFromTorch(embeddingPath)

recognizer = pickle.loads(open(path+'output/recognizer.pickle', "rb").read())
le = pickle.loads(open(path+'output/le.pickle', "rb").read())


def recognize(_base64, _confidence=0.25):
    imgdata = base64.b64decode(_base64)
    img = Image.open(BytesIO(imgdata))
    _w, _h = img.size
    if _w > _h:
        img = img.rotate(-90)
    img.save(path+'img.jpg')

    
    image = imutils.resize(cv2.imread(path+'dataset/Pham Hong Kha/kha.jpg'), width=600)
    (h, w) = image.shape[:2]

    imageBlob = cv2.dnn.blobFromImage(
        cv2.resize(image, (300, 300)), 1.0, (300, 300),
        (104.0, 177.0, 123.0), swapRB=False, crop=False)

    detector.setInput(imageBlob)
    detections = detector.forward()

    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]

        if confidence > _confidence:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            face = image[startY:endY, startX:endX]
            (fH, fW) = face.shape[:2]

            if fW < 20 or fH < 20:
                continue

            faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255, (96, 96),
                                             (0, 0, 0), swapRB=True, crop=False)
            embedder.setInput(faceBlob)
            vec = embedder.forward()

            preds = recognizer.predict_proba(vec)[0]
            j = np.argmax(preds)
            proba = preds[j]
            name = le.classes_[j]
            return name
