https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speaker-recognition?tabs=script&pivots=programming-language-javascript

https://github.com/Janghyun1230/Speaker_Verification

https://github.com/MohamadMerchant/Voice-Authentication-and-Face-Recognition

--------------------------------------------
ng serve --prod=true --watch=true

ng build --prod=true

ng build --prod=true --aot=true --output-hashing none

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


--minimal removes removes testing frameworks
--inline-template puts all component templates in the .ts file
--inline-styles puts all component styles in the .ts file
--routing=false does not add any routing
--style=css specifies to use CSS
ng serve --hrm


https://school.geekwall.in/p/Hy29kFEGm/face-recognition-in-the-browser-with-tensorflow-js-javascript


addd

ng add angular-cli-ghpages


To start, build your project. For this option, Github Pages requires that the built project contents be solely on amaster or gh-pages branch or in adocs folder on the master branch. Here I’ll illustrate the later option. In the command below, the --outputPath=docs flag makes ng build output the resultant build to adocs folder. The --prod=true makes sure the resultant build is optimized for a production target. If you’re deploying to a user page, you do not need to specify --baseHref flag because it defaults to /. However, for project pages, --baseHref should be the name of the repository because the deployment URL will be <username>.github.io/samples/.
ng build --prod=true --outputPath=docs --baseHref=/samples/
ng build --prod --base-href "<repo-name>"

If your project uses the Angular router, the routes you’ve configured on it will not be available from the server when requested directly on the browser address bar or when a page is refreshed. In those instances, you’ll get a 404 page which is not ideal. To remedy this, you’ll need to indicate to the server that if it gets a request for a page that it does not have, it should send the route to the index.html page. You do this by copying the index.html file and renaming the copy to 404.html. This ensures that all the routes the server does not have will be rerouted to the Angular router. You can read more about this here and here.

cp docs/index.html docs/404.html

git remote add origin https://github.com/lyudmilpetrov/samples.git

git remote rm origin

ng build --prod --baseHref="https://lyudmilpetrov.github.io/samples/"


Now, we need to build our code in production mode in order to create distributable files that will be deployed on GitHub Pages. By default, this deployable code is generated in the /dist/<prodect-name> folder under the app folder, but we need to generate this in the “docs” folder under the app folder.

So, we need to make a small change in the angular.json file and change the outputpath value to “docs/”.

Another point to be noted is your URL is going to be hosted app on the Github Pages as https://username.github.io/respositoryname.

In my case, it would be https://sanjaysaini2000.github.io/todo-app.

This URL is needed to set the base URL of our website while generating the distributable files to deploy on GitHub Pages.

So now, run the following command with your website URL in the baseHref  option in the git bash window to generate distributable files in the docs folder.

ng build --prod --baseHref="https://lyudmilpetrov.github.io/samples/"
Note that the username and repository name will be your GitHub username and repository name.

Go to your app folder and check that the docs folder is created and contains all of the distributable files.


git add .

git commit -m "generated deployables"

git push -u origin master

ng deploy --repo=https://github.com/lyudmilpetrov/samples.git


https://www.gatsbyjs.com/docs/how-gatsby-works-with-github-pages/


ng build --prod --output-path docs --base-href https://lyudmilpetrov.github.io/samples/
https://storage.googleapis.com/tfjs-models/demos/face-landmarks-detection/index.html

Ading facemash
https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection


npm install @tensorflow-models/facemesh --save
npm install @tensorflow-models/face-landmarks-detection --save
npm install @tensorflow/tfjs-core --save
npm install @tensorflow/tfjs-converter --save
npm install @tensorflow/tfjs-backend-wasm --save
npm install @tensorflow/tfjs-backend-webgl --save

PWA

1) ng add @angular/pwa
2) npm install http-server -g
3) add "start-pwa": "ng build --prod && http-server -p 8080 -c-1 dist/speech-recognition" to package.json
4) npm run start-pwa

add "src/manifest.webmanifest" under assets in angular.json

https://blog.angular-university.io/angular-service-worker/
https://web.dev/creating-pwa-with-angular-cli/

add manually to index.html

<link rel="manifest" href="/manifest.webmanifest">

"outputPath": "C:\\Users\\ljudm\\source\\repos\\samples\\wwwroot\\",


Now in Javascript you have two options:
Set href attribute using a URL:
document.querySelector('#my-manifest-placeholder').setAttribute('href', '/my-dynamic-manifest-url.json');

2. Use a JSON object to set your manifest
var myDynamicManifest = {
  "name": "Your Great Site",
  "short_name": "Site",
  "description": "Something dynamic",
  "start_url": "<your-url>",
  "background_color": "#000000",
  "theme_color": "#0f4a73",
  "icons": [{
    "src": "whatever.png",
    "sizes": "256x256",
    "type": "image/png"
  }]
}
const stringManifest = JSON.stringify(myDynamicManifest);
const blob = new Blob([stringManifest], {type: 'application/json'});
const manifestURL = URL.createObjectURL(blob);
document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);

Both ways work.
By this, you can allow your app users to customize the icon, colors, and even the very name of your app without any server involvement.


1234
12345
