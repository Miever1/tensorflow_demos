import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { InputNumber } from "antd";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

const LinearRegression:FunctionComponent<{}> = () => {
  const [inputValue, setInputValue] = useState(0);
  const [predictValue, setPredictValue] = useState(0);
  const [training, setTraining] = useState(true);
  const model = useRef(tf.sequential());

  const trainData = async () => {
    const inputs = [1, 2, 3, 4];
    const outputs = [1, 3, 5, 7];

    const tensor_inputs = tf.tensor(inputs);
    const tensor_outputs = tf.tensor(outputs);
    model.current.add(tf.layers.dense({ units: 1, inputShape: [1]}));
    model.current.compile({
      // 损失函数，均方误差
      loss: tf.losses.meanSquaredError,
      // 优化器 随机梯度下降
      optimizer: tf.train.sgd(0.1)
    });

    tfvis.visor().open();
    tfvis.render.scatterplot(
      { name: "线性回归训练集" },
      { values: inputs.map((item, index) => ({ x: item, y: outputs[index]})) },
      { xAxisDomain: [0, 6], yAxisDomain: [0, 12] }
    );
    await model.current.fit(
      tensor_inputs,
      tensor_outputs,
      {
        batchSize: 4,
        epochs: 200,
        callbacks: tfvis.show.fitCallbacks(
          { name: "训练过程" },
          ['loss']
        )
      }
    );
    setTraining(false);
  }

  useEffect(() => {
    trainData();
    return () => {
      tfvis.visor().close();
    }
  }, []);

  useEffect(() => {
    const predictValue = (model.current.predict(tf.tensor([inputValue])));
    console.log(predictValue)
    // @ts-ignore
    setPredictValue(predictValue.dataSync());
  }, [inputValue]);
  

  return (
    <div>
      <h1>
        线性回归训练集
      </h1>
      <div>
        <span>
          输入：
        </span>
        <InputNumber
          disabled={training}
          value={inputValue}
          onChange={value => setInputValue(value)}
        />
      </div>
      <div>
        <span>
          {`预测： ${predictValue}`}
        </span>
      </div>
    </div>
  );
}

export default LinearRegression;