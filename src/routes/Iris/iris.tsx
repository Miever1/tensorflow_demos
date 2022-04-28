import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Input } from "antd";

import { getIrisData, IRIS_CLASSES } from './data';
import CommonContent from "../../components/CommonContent";

const Iris:FunctionComponent<{}> = () => {
    const [xTrain, yTrain, xTest, yTest] = getIrisData(0.15);
    const model = useRef(tf.sequential());
    const [training, setTraining] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [predictValue, setPredictValue] = useState(0);
    
    const trainData = async () => {
    
        model.current.add(tf.layers.dense({
            units: 10,
            inputShape: [xTrain.shape[1]] as number[],
            activation: "sigmoid"
        }));

        model.current.add(tf.layers.dense({
            units: 3,
            activation: "softmax"
        }));

        model.current.compile({
          loss: 'categoricalCrossentropy',
          optimizer: tf.train.adam(0.1),
          metrics: ["accuracy"]
        });
    
        tfvis.visor().open();
        await model.current.fit(xTrain, yTrain, {
            epochs: 100,
            validationData: [xTest, yTest],
            callbacks: tfvis.show.fitCallbacks(
                { name: '训练效果' },
                ['loss', 'val_loss', 'acc', 'val_acc'],
                {
                    callbacks: ['onEpochEnd']
                }
            )
        });
        setTraining(false);
    }
    
    useEffect(() => {
        trainData();
        return () => {
            tfvis.visor().close();
        }
    }, []);

    useEffect(() => {
        const [x, y, z, q] = inputValue.split(",");
        if (!x || !y || !z || !q) {
            return;
        }
        const predictValue = (model.current.predict(tf.tensor(
          [[Number(x), Number(y), Number(z), Number(q)]]
        )));
        // @ts-ignore
        setPredictValue(IRIS_CLASSES[predictValue.argMax(1).dataSync(0)]);
    }, [inputValue]);

    return (
        <CommonContent title="iris训练集">
            <Input
                style={{ width: '20%' }}
                placeholder="请输入预测值（x，y, z, q）"
                disabled={training}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            <div>
              {!training && !!inputValue.split(",")[1] && (`预测： ${predictValue}`)}
            </div>
        </CommonContent>
    )
}

export default Iris;