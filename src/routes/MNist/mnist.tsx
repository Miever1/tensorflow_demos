import React, { FunctionComponent, useRef, useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Button, Space } from "antd";

import { MnistData } from './data';
import CommonContent from "../../components/CommonContent";

const MNist:FunctionComponent<{}> = () => {
    const model = useRef(tf.sequential());
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    if (canvasRef.current) {
        canvasRef.current.height = 300;
        canvasRef.current.width = 300;
        canvasRef.current.style = "border: 2px solid #666;";
    }
    const [training, setTraining] = useState(true);
    
    const trainData = async () => {
        const data = new MnistData();
        await data.load();
        const examples = data.nextTestBatch(20);
        const surface = tfvis.visor().surface({
            name: "输入示例"
        })
        for (let i = 0; i < 20; i += 1) {
            const imageTensor = tf.tidy(() =>
                examples.xs.slice([i, 0], [1, 784]).reshape([28, 28, 1])
            );
            const canvas = document.createElement('canvas');
            canvas.height = 28;
            canvas.width = 28;
            canvas.style = "margin: 4px;";
            await tf.browser.toPixels(imageTensor, canvas);
            surface.drawArea.appendChild(canvas);
        }

        model.current.add(tf.layers.conv2d({
            inputShape: [28, 28, 1],
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: "relu",
            kernelInitializer: "varianceScaling"
        }));

        model.current.add(tf.layers.maxPool2d({
            poolSize: [2, 2],
            strides: [2, 2]
        }));

        model.current.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
            strides: 1,
            activation: "relu",
            kernelInitializer: "varianceScaling"
        }));

        model.current.add(tf.layers.maxPool2d({
            poolSize: [2, 2],
            strides: [2, 2]
        }));

        model.current.add(tf.layers.flatten());

        model.current.add(tf.layers.dense({
            units: 10,
            activation: "softmax",
            kernelInitializer: "varianceScaling"
        }));

        tfvis.visor().open();

        model.current.compile({
            loss: "categoricalCrossentropy",
            optimizer: tf.train.adam(),
            metrics: 'accuracy'
        });

        const [trainXs, trainYs] = tf.tidy(() => {
            const d = data.nextTrainBatch(1000);
            return [
                d.xs.reshape([1000, 28, 28, 1]),
                d.labels
            ]
        });
        const [testXs, testYs] = tf.tidy(() => {
            const d = data.nextTrainBatch(200);
            return [
                d.xs.reshape([200, 28, 28, 1]),
                d.labels
            ]
        });
        await model.current.fit(trainXs, trainYs, {
            validationData: [testXs, testYs],
            epochs: 100,
            callbacks: tfvis.show.fitCallbacks(
                { name: '训练效果' },
                ['loss', 'val_loss', 'acc', 'val_acc'],
                {
                    callbacks: ["onEpochEnd"]
                }
            )
        });
        setTimeout(() => {
            onCanvasClear();
        }, 500);
        setTraining(false);
    }

    const onCanvasClear = useCallback(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, 300, 300);
        }
    },[])

    const predict = useCallback(() => {
        const input = tf.tidy(() => {
            if (canvasRef.current) {
                return tf.image.resizeBilinear(
                    tf.browser.fromPixels(canvasRef.current),
                    [28, 28],
                    true
                ).slice([0, 0, 0], [28, 28, 1])
                .toFloat()
                .div(255)
                .reshape([1, 28, 28, 1]);
            }
        });
        // @ts-ignore
        const pred = model.current.predict(input).argMax(1);
        alert(`预测值为： ${pred.dataSync()[0]}`)
    }, []);
    
    useEffect(() => {
        trainData();
        canvasRef.current?.addEventListener('mousemove', e => {
            if (e.buttons === 1) {
                const ctx = canvasRef.current?.getContext('2d');
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx?.fillRect(e.offsetX, e.offsetY, 18, 18);
            }
        });
        return () => {
            tfvis.visor().close();
        }
    }, []);


    return (
        <CommonContent title="mnist 训练集,手写数字预测">
            <canvas ref={canvasRef} />
            <br />
            <Space>
                <Button onClick={onCanvasClear}>
                    Clear
                </Button>
                <Button
                    disabled={training}
                    onClick={predict}
                >
                    Predict
                </Button>
            </Space>
        </CommonContent>
    )
}

export default MNist;