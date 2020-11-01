https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speaker-recognition?tabs=script&pivots=programming-language-javascript

https://github.com/Janghyun1230/Speaker_Verification



https://github.com/MohamadMerchant/Voice-Authentication-and-Face-Recognition


# SpeechRecognition
So let’s get started. Initial step is to convert the existing saved_model or frozen model to model.json. For conversion we’ll be using tensorflowjs_converter
Step 1: Model Conversion.
Convert your existing model by first installing TensorFlow Js by using the following command
$ pip install tensorflowjs
The best thing about TensorFlow Js is that it’s independent of the type of the model. It is compatible with both saved model as well as frozen model for conversion.
For Saved model: Run the following command.
$ tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_node_names='MobilenetV1/Predictions/Reshape_1' \
    --saved_model_tags=serve \
    /mobilenet/saved_model \
    /mobilenet/web_model
Note: where /mobilenet/saved_model is the input_path directory where the saved_model.pb file along with it’s weights are present and /mobilenet/web_model is the output_path where the converted model.json and it’s shard files will be stored.
For Frozen model: Run the following command
$ tensorflowjs_converter \
    --input_format=tf_frozen_model \
    --output_node_names='MobilenetV1/Predictions/Reshape_1' \
    /mobilenet/frozen_model.pb \
    /mobilenet/web_model
Note: where /mobilenet/frozen_model.pb is the input_path and /mobilenet/web_model is the output_path where model.json will be stored after conversion.
Note: if you encounter an error of NonMaxSupressionV5 during model conversion then try to retrain the model by downgrading the tensorflow version to 1.14.0 and then again follow the same process for model conversion.
For successful model conversion the following are the requirements:
1. tensorflow  v_1.14.0
2. tensorflowjs v_1.3.2
Let’s integrate the model with angular
We assume that the required components are created using angular-cli.


npm install @tensorflow/tfjs -- save

Step 3: Place the model.json file along with it’s generated shard files in assets folder.
Step 4: For prediction let’s add a canvas and a video element in component’s HTML.
<video #videoCamera hidden id="video"></video>
<canvas #canvas id="canvas"></canvas>
@ViewChild('videoCamera', {static: true}) videoCamera: ElementRef;
@ViewChild('canvas', {static: true}) canvas: ElementRef;
<div class="wrapper">
   <canvas drawable (newImage)="predict($event)"></canvas>
</div>

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
