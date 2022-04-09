import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Input } from "antd";

import { getData } from './data';
import CommonContent from "../../components/CommonContent";

const LogisticRegression:FunctionComponent<{}> = () => {
    const data = getData(400);
    const model = useRef(tf.sequential());
    const [training, setTraining] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [predictValue, setPredictValue] = useState(0);
    
    const trainData = async () => {
        const inputs = tf.tensor(data.map(p => [p.x, p.y]));
        const labels = tf.tensor(data.map(p => p.label));
    
        model.current.add(tf.layers.dense({
            units: 1,
            inputShape: [2],
            activation: "sigmoid"
        }));

        model.current.compile({
          loss: tf.losses.logLoss,
          optimizer: tf.train.adam(0.1)
        });
    
        tfvis.visor().open();
        tfvis.render.scatterplot(
          { name: '逻辑回归训练数据' },
          {
              values: [
                  data.filter(p => p.label === 1),
                  data.filter(p => p.label === 0),
              ]
          }
        );
        await model.current.fit(inputs, labels, {
            batchSize: 40,
            epochs: 50,
            callbacks: tfvis.show.fitCallbacks(
                { name: '训练效果' },
                ['loss']
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
      const [x, y] = inputValue.split(",");
      if (!x || !y) {
        return;
      }
      const predictValue = (model.current.predict(tf.tensor([[Number(x), Number(y)]])));
      // @ts-ignore
      setPredictValue(predictValue.dataSync()[0]);
    }, [inputValue]);

    return (
        <CommonContent title="逻辑回归训练集">
            <Input
                style={{ width: '20%' }}
                placeholder="请输入预测值（x，y）"
                disabled={training}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            <div>
              {!training && inputValue.split(",")[1] && (`预测： ${Math.round(predictValue) === 1 ? "蓝色" : "黄色"}`)}
            </div>
        </CommonContent>
    )
}

export default LogisticRegression;