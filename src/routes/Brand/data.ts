const loadImg = (src: string) => {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.width = 224;
        img.height = 224;
        img.onload = () => resolve(img);
    });
}

export const getInputs = async () => {
    const loadImgs: Promise<unknown>[] = [];
    const labels: (0 | 1)[][] = [];
    for (let i = 0; i < 30; i+= 1) {
        ['android', 'apple', 'windows'].forEach(label => {
            const img = loadImg(`http://127.0.0.1:8080/brand/train/${label}-${i}.jpg`);
            loadImgs.push(img);
            labels.push([
                label === 'android' ? 1 : 0,
                label === 'apple' ? 1 : 0,
                label === 'windows' ? 1 : 0,
            ])
        });
    }
    const inputs = await Promise.all(loadImgs);
    return {
        inputs,
        labels
    }
}