import React, { FunctionComponent, useEffect, useState } from "react";
import { create } from "@tensorflow-models/speech-commands";

import CommonContent from "../../components/CommonContent";

const MODEL_PATH = 'http://127.0.0.1:8080/speech';

const Speech: FunctionComponent<{}> = () => {
    const [labels, setLabels] = useState<string []>([]);
    const [index, setIndex] = useState(0);
    const predict = async () => {
        const recognizer = create(
            'BROWSER_FFT',
            undefined,
            MODEL_PATH + '/model.json',
            MODEL_PATH + '/metadata.json',
        );
        await recognizer.ensureModelLoaded();
        const labelsList = recognizer.wordLabels().slice(2);
        setLabels(labelsList);
        // @ts-ignore
        recognizer.listen(result => {
            const { scores } = result;
            // @ts-ignore
            const maxValue = Math.max(...scores);
            // @ts-ignore
            const index = scores.indexOf(maxValue);
            setIndex(index);
        },{
            overlapFactor: 0.2,
            probabilityThreshold: 0.8,
        });
    };

    useEffect(() => {
      predict();
    }, []);
   
    return (
        <CommonContent title="使用预训练模型进行语音识别">
            <div>
                {labels.map((item, labelIndex) => {
                    const style = (index - 2 === labelIndex) ? {
                        background: "green"
                    } : {};
                    return (
                        <span style={style}>{item},</span>
                    );
                })}
            </div>
        </CommonContent>
    )
}

export default Speech;