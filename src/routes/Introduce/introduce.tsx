import React, { FunctionComponent, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const Introduce:FunctionComponent<{}> = (): JSX.Element => {
  // rankType 代表维度,几维数组
  // shape 数组结构
  // size 里面有多少个数值
  // const t0 = tf.tensor(1);
  // const t1 = tf.tensor([1, 2]);
  // const t2 = tf.tensor([[1, 2], [3, 4]]);
  // const t3 = tf.tensor([[1, 2, 3, [6, 7]], [3, 4, 5, [6, 7]]]);
  // console.log(t0, t1, t2, t3);

  const input = [1, 2, 3, 4];
  const w = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [4, 5, 6, 7]];
  let output = [0, 0, 0, 0];

  const tensor = tf.tensor(input).dot(w);
  
  const getData = () => {
    for (let i = 0; i < w.length; i ++) {
      for (let j = 0; j < input.length; j ++) {
        output[i] += input[j] * w[i][j];
      }
    }
  }

  useEffect(() => {
    getData();
    console.log(output, 'for loop');
    console.log(tensor, 'tensor')
  },[]);

  return (
    <div>
    </div>
  );
}

export default Introduce;