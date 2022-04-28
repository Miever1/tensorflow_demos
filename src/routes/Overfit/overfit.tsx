import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

import { getData } from '../XOR/data';
import CommonContent from "../../components/CommonContent";

const Overfit:FunctionComponent<{}> = () => {
    const data = getData(400);
    const model = useRef(tf.sequential());
    
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
          { name: '训练数据' },
          {
              values: [
                  data.filter(p => p.label === 1),
                  data.filter(p => p.label === 0),
              ]
          }
        );
        await model.current.fit(inputs, labels, {
            epochs: 200,
            validationSplit: 0.2,
            callbacks: tfvis.show.fitCallbacks(
                { name: '训练效果' },
                ['loss', 'val_loss'],
                {
                    callbacks: ['onEpochEnd']
                }
            )
        });
    }
    
    useEffect(() => {
        trainData();
        return () => {
            tfvis.visor().close();
        }
    }, []);

    return (
        <CommonContent title="欠拟合训练集">
           
        </CommonContent>
    );
}

export default Overfit;