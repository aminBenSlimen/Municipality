
let model;
let targetLabel = 'C';
let trainingData = [];
let FinalResult = 'init';
let state = 'prediction';

function modelLoaded() {
    state = 'prediction';
}
function getModel() {
    return model
}
function train(t) {
    trainingData = t;
    trainingData.forEach((elm) => {
        model.addData(elm.inputs, elm.target);
    })
    state = 'training';
    console.log('starting training');
    model.normalizeData();
    let options = {
        epochs: 1000
    };
    model.train(options, whileTraining, finishedTraining);
}
function changeLabel(label) {
    targetLabel = label;
    console.log(label)
}
function whileTraining(epoch, loss) {
    console.log(epoch);
}

function finishedTraining() {
    console.log('finished training.');
    state = 'prediction';
    model.save('myModule');

}

function collectData(x, y) {
    let inputs = {
        x: Number(x),
        y: Number(y)
    };

    if (state == 'collection') {
        let target = {
            label: targetLabel
        };
        trainingData.push({ inputs, target })

    }
    else if (state == 'prediction') {
        return model.predict(inputs)

    }

}
function returnToTs() {
    return FinalResult;
}