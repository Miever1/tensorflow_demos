import React, { FunctionComponent, useEffect, useState, useRef } from "react";
import { InputNumber } from "antd";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

import CommonContent from "../../components/CommonContent";

const HeightWeight:FunctionComponent<{}> = () => {
  const [inputValue, setInputValue] = useState(0);
  const [predictValue, setPredictValue] = useState(0);
  const [training, setTraining] = useState(true);
  const model = useRef(tf.sequential());

  const trainData = async () => {
    const heights = [150, 160, 170];
    const weights = [40, 50, 60];

    const tensor_inputs = tf.tensor(heights).sub(150).div(20);
    const tensor_outputs = tf.tensor(weights).sub(40).div(20);;

    model.current.add(tf.layers.dense({ units: 1, inputShape: [1]}));
    model.current.compile({
      // 损失函数，均方误差
      loss: tf.losses.meanSquaredError,
      // 优化器 随机梯度下降
      optimizer: tf.train.sgd(0.1)
    });

    tfvis.visor().open();
    tfvis.render.scatterplot(
      { name: "身高体重训练数据" },
      { values: heights.map((item, index) => ({ x: item, y: weights[index]})) },
      { xAxisDomain: [140, 190], yAxisDomain: [30, 90] }
    );
    await model.current.fit(
      tensor_inputs,
      tensor_outputs,
      {
        batchSize: 3,
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
    // @ts-ignore
    const predictValue = (model.current.predict(tf.tensor([inputValue]).sub(150).div(20))).mul(20).add(40);
    // @ts-ignore
    setPredictValue((predictValue.dataSync()[0]).toFixed(2));
  }, [inputValue]);
  

  return (
    <CommonContent title="身高体重训练数据">
      <div>
        <span>
          输入身高：
        </span>
        <InputNumber
          disabled={training}
          value={inputValue}
          onChange={value => setInputValue(value)}
        />
        <span>cm</span>
      </div>
      <div>
        {!training && `体重预测： ${predictValue}kg`}
      </div>
    </CommonContent>
  );
}

export default HeightWeight;