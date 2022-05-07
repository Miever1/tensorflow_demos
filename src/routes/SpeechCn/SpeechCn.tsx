import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import * as tfvis from "@tensorflow/tfjs-vis";
import { Slide } from 'react-slideshow-image';
import { Button, Space, message, Switch } from "antd";
import { create, TransferSpeechCommandRecognizer } from "@tensorflow-models/speech-commands";

import 'react-slideshow-image/dist/styles.css';
import CommonContent from "../../components/CommonContent";

const MODEL_PATH = 'http://127.0.0.1:8080/speech';

let transferRecognizer: TransferSpeechCommandRecognizer | null = null;


const slideImages = [
    'https://cdn.theatlantic.com/thumbor/W544GIT4l3z8SG-FMUoaKpFLaxE=/0x131:2555x1568/1600x900/media/img/mt/2017/06/shutterstock_319985324/original.jpg',
    'https://i.ytimg.com/vi/MPV2METPeJU/maxresdefault.jpg',
    'https://miro.medium.com/max/3150/2*I6JtlwYDoKqCJdTzwnDOvQ.jpeg'
];

const SpeechCn:FunctionComponent<{}> = () => {
    const [disabeld, setDisabeld] = useState(false);
    const [openMic, setOpenMic] = useState(false);
    const [label, setLabel] = useState("");
    const sliderRef = useRef<any>(null);
    const init = async () => {
        const recognizer = create(
            'BROWSER_FFT',
            undefined,
            MODEL_PATH + '/model.json',
            MODEL_PATH + '/metadata.json',
        );
        await recognizer.ensureModelLoaded();
        transferRecognizer = recognizer.createTransfer('轮播图');
    };

    const collect =  async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setDisabeld(true);
        const label = (e.target as HTMLElement).innerHTML;
        if (transferRecognizer) {
            await transferRecognizer.collectExample(
                label === "背景噪音" ? "_background_noise_" : label
            );
        }
        setDisabeld(false);
        message.success(`收集成功： ${JSON.stringify(transferRecognizer?.countExamples())}`)
    };

    const train =  async () => {
        tfvis.visor().open();
        await transferRecognizer?.train({
            epochs: 30,
            callback: tfvis.show.fitCallbacks(
                { name: '训练效果' },
                ['loss', 'acc'],
                {
                    callbacks: ['onEpochEnd']
                }
            )
        })
    };

    const listen = async () => {
        tfvis.visor().close();
        if (openMic) {
            // @ts-ignore
            await transferRecognizer?.listen(data => {
                const { scores } = data;
                const labels = transferRecognizer?.wordLabels();
                // @ts-ignore
                setLabel(labels[scores.indexOf(Math.max(...scores))]);
            }, {
                overlapFactor: 0,
                probabilityThreshold: 0.75
            })
        } else {
            transferRecognizer?.stopListening();
        }
    }

    const save = () => {
        const arrayBuffer = transferRecognizer?.serializeExamples();
        if (arrayBuffer) {
            const bolb = new Blob([arrayBuffer]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(bolb);
            link.download = 'data.bin';
            link.click();
        }
    }

    useEffect(() => {
      if (label) {
            if (label === "上一张") {
                sliderRef.current?.goBack();
            } else if (label === "下一张") {
                sliderRef.current?.goNext();
            }
      }
    }, [label]);

    console.log(label)

    useEffect(() => {
        listen();
    }, [openMic]);

    useEffect(() => {
        init();
        return () => {
            tfvis.visor().close();
        }
    }, []);

    return (
        <CommonContent title="基于迁移学习的语音识别器，声控轮播图">
            <h2>收集语音</h2>
            <Space>
                <Button
                    onClick={collect}
                    disabled={disabeld}
                >
                    上一张
                </Button>
                <Button
                    onClick={collect}
                    disabled={disabeld}
                >
                    下一张
                </Button>
                <Button
                    onClick={collect}
                    disabled={disabeld}
                >
                    背景噪音
                </Button>
                <Button
                    onClick={save}
                >
                    数据保存
                </Button>
            </Space>
            <hr />
            <h2>训练</h2>
            <Space>
                <Button
                    onClick={train}
                >
                    训练
                </Button>
            </Space>
            <hr />
            <h2>监听开关</h2>
            <Space>
                <Switch
                    checked={openMic}
                    onClick={value => setOpenMic(value)}
                />
            </Space>
            <div className="slide-container" >
                <br />
                <br />
                <Slide autoplay={false} ref={sliderRef}>
                    {slideImages.map((slideImage, index)=> (
                        <div className="each-slide" key={index}>
                            <div
                                style={{
                                    backgroundImage: `url(${slideImage})`,
                                    height: "600px",
                                    width: "100%",
                                }}
                            />
                        </div>
                    ))} 
                </Slide>
            </div>
        </CommonContent>
    )
};

export default SpeechCn;