import React, { FunctionComponent } from "react";
import * as tf from "@tensorflow/tfjs";
import { Input } from "antd";
import { IMAGENET_CLASSES } from "./imagenet_classes";

import CommonContent from "../../components/CommonContent";

const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8080/mobilenet/web_model/model.json';

const fileToImg = (file: Blob) => {
    return new Promise(resolve => {
        const reader = new FileReader;
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = document.createElement('img');
            // @ts-ignore
            img.src = e.target.result;
            img.height = 224;
            img.width = 224;
            img.onload = () => resolve(img)
        }
    });
}

const MobileNet:FunctionComponent<{}> = () => {
    const predict = async (file: Blob) => {
        const model = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
        const img = await fileToImg(file);
        const pred = tf.tidy(() => {
            const input = tf.browser.fromPixels(img as HTMLImageElement)
                .toFloat().div(255/2).reshape([1, 224, 224, 3]);
            return model.predict(input);
        });
        // @ts-ignore
        alert(`预测结果： ${IMAGENET_CLASSES[pred.argMax(1).dataSync()[0]]}`)
    };

    return (
        <CommonContent title="使用预训练模型进行图片分类">
            <Input type="file" onChange={(e) => {
                if (e.target.files) {
                    predict(e.target.files[0])
                }
            }} />
        </CommonContent>
    )
}

export default MobileNet;