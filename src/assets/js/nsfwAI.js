
function log(d) {
    try {
        // console.log(d.rawData.outputs[0].data.concepts[0].name);
        // console.log(d.rawData.outputs[0].data.concepts[0].value);
        document.getElementById("test").value = d.rawData.outputs[0].data.concepts[0].name;
    } catch (e) {
        console.log(d);
    }
}

// Prediction on general model using video API
function nsfwCheck(img) {
    //const Clarifai = process.env.TRAVIS ? require('clarifai') : require('../src');
    let y;
    const clarifai = new Clarifai.App({
        apiKey: "3fc55adfc09c48248650f249f5757205"
    });

    clarifai.models.predict(Clarifai.NSFW_MODEL, { base64: "" + img })
        .then(log)
        .catch(log);


}