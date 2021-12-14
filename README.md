# Canteen Automation System

## Description
+ ***server*** 
  + Directory contains source code for backend.

+ ***client*** 
  + Directory contains source code for customer frontend.

+ ***docs*** 
  + Directory contains design files of the project.

---

## Build the system
Install NPM Packages for Backend
```zsh
cd ./server
npm install
```
Install NPM Packages for Frontend
```zsh
cd ./client
npm install
```

> Client app Uses ReactNativeCLI, so make sure you have installed watchman

To install Pods
```zsh
cd ./client/ios
pod install
```

---

## Run the system
To run the backend server
```zsh
npm run api
# Run the following command on another shell
npm run authServer
```

To run the client app on iOS simulator or phone
```zsh
cd ./client
npm run ios
```
> Ensure that you have iPhone/iPad connected or Xcode Simulator already setup.

To run the client app on Android simulator or phone
```zsh
cd ./client
npm run android
```
> Ensure that you have Android Smartphone connected or Android Emulator already setup.

To just run Metro
```
cd ./client
npm start
```

***
## <p align="center">Powered By</p>
<center>

[![Mysql](https://img.shields.io/static/v1?label=&message=MySQL&logo=mysql&labelWidth=60&labelColor=FFF&color=007799)](https://www.mysql.com/)
[![Express](https://img.shields.io/static/v1?label=&message=Express.js&logo=express&labelColor=666&color=FFF)](https://expressjs.com/)
[![React.js](https://img.shields.io/static/v1?label=&message=React&color=0099FF&logo=react&labelColor=FFF&logoColor=0099FF)](https://reactjs.org/)
[![Node](https://img.shields.io/static/v1?label=&message=Node.js&logo=nodedotjs&labelWidth=60&labelColor=FFF&color=009955)](https://www.nodejs.org/)

[![Github](https://img.shields.io/static/v1?label=&message=Github&logo=github&labelColor=444&color=FFF)](https://www.github.com/)
[![Razorpay](https://img.shields.io/static/v1?label=&message=Razorpay&logo=razorpay&logoColor=005599&labelColor=FFF&color=005599)](https://razorpay.com/)
[![CoEP](https://img.shields.io/static/v1?label=&message=CoEP&color=555&labelWidth=60&labelColor=FFF&logo=data:image/jpeg;base64,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)](https://www.coep.org.in/)</center>

## Preview
![Signin Page](/docs/Screenshots/Signin.png)