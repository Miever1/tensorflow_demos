import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Input } from "antd";

import { getInputs } from "./data";
import { fileToImg } from "../MobileNet/mobile-net";
import CommonContent from "../../components/CommonContent";

const BRAND_CLASSES = ['android', 'apple', 'windows'];
const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8080/mobilenet/web_model/model.json';

const imgToX = (imgEl: HTMLImageElement) => {
    return tf.tidy(() => {
        return tf.browser.fromPixels(imgEl)
            .toFloat().div(255/2).reshape([1, 224, 224, 3]);
    });
}

let truncatedMobilenet: any = null;

const Brand: FunctionComponent<{}> = () => {
    const model = useRef(tf.sequential());
    const [loading, setLoading] = useState(false);
    const training = async () => {
        setLoading(true);
        tfvis.visor().open();
        const { inputs, labels } = await getInputs();
        const surface = tfvis.visor().surface({
            name: "输入示例",
            styles: {
                height: "250px"
            }
        });
        inputs.forEach(item => {
            surface.drawArea.appendChild(item as Node);
        });
        const mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
        const layer = mobilenet.getLayer('conv_pw_13_relu');
        truncatedMobilenet = tf.model({
            inputs: mobilenet.inputs,
            outputs: layer.output
        });

        model.current.add(tf.layers.flatten({
            // @ts-ignore
            inputShape: layer.outputShape.slice(1)
        }));

        model.current.add(tf.layers.dense({
            units: 10,
            activation: "relu"
        }));

        model.current.add(tf.layers.dense({
            units: 3,
            activation: "softmax"
        }));

        model.current.compile({
            loss: 'categoricalCrossentropy',
            optimizer: tf.train.adam(),
        });

        const { xTrain, yTrain } = tf.tidy(() => {
            // @ts-ignore
            const xTrain = tf.concat(inputs.map(imgEl => truncatedMobilenet.predict(imgToX(imgEl as HTMLImageElement))));
            const yTrain = tf.tensor(labels);
            return {
                xTrain,
                yTrain
            }
        });

        await model.current.fit(xTrain, yTrain, {
            epochs: 10,
            callbacks: tfvis.show.fitCallbacks(
                { name: '训练效果' },
                ['loss'],
                {
                    callbacks: ['onEpochEnd']
                }
            )
        });
        setLoading(false);
    }

    const predict = async (file: Blob) => {
        const img = await fileToImg(file);
        const pred = tf.tidy(() => {
            const x = imgToX(img as HTMLImageElement);
            const input = truncatedMobilenet.predict(x);
            return model.current.predict(input);
        });
        // @ts-ignore
        alert(`预测结果： ${BRAND_CLASSES[pred.argMax(1).dataSync()[0]]}`)
    };

    useEffect(() => {
        training();
        return () => {
            tfvis.visor().close();
        }
    }, []);
    

    return (
        <CommonContent title="基于迁移学习的图像分类器">
            <Input
                type="file"
                onChange={(e) => {
                    if (e.target.files) {
                        predict(e.target.files[0])
                    }
                }}
                disabled={loading}
            />
        </CommonContent>
    );
}

export default Brand;