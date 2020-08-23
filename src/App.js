import React from 'react';
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import './App.css';
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import ImageLink from "./components/ImageLink/ImageLink";
import Rank from "./components/Rank/Rank";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";


//  params props for particle js...
const parameters = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
    // line_linked: {
    //   shadow: {
    //     enable: true,
    //     color: "#3CA9D1",
    //     blur: 5
    //   }
    // }
  }
}

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("image");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    // console.log(event.target.value)
    this.setState({input: event.target.value})
  }

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({isSignedIn: true});
    }else {
      this.setState(initialState)
    }
    this.setState({route});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch("https://joel-node.herokuapp.com/imageAPI", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch("https://joel-node.herokuapp.com/image", {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: this.state.user.id
          })
        }).then(response => response.json())
          .then(count => {
            // console.log(count)
            // this.setState({user: {
            //   entries: count
            // }}) Why
            // We didn't update the entire user just the entries...
            this.setState(Object.assign(this.state.user, {entries: count}))
          }).catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    } )
    .catch(err =>console.log(err, "Something was wrong!"))
  }

  render() {
    const {onRouteChange, onSubmit, onInputChange, loadUser} = this;
    const {route, isSignedIn, imageUrl, box} = this.state;
    return (
      <div className="App">
        <Particles params={parameters} className="particles" />
        <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn}/>
        { route === "home" ?
          <div>
            <Logo />
            <Rank user={this.state.user}/>
            <ImageLink onInputChange={onInputChange} onSubmit={onSubmit}/>
            <FaceRecognition imageUrl={imageUrl} box={box}/>
          </div> :
          (
            route === "signin" ?
              <Signin onRouteChange={onRouteChange} loadUser={loadUser}/>  :
              <Register onRouteChange={onRouteChange} loadUser={loadUser}/>
          )
        }
      </div>
    );
  }
  
}

export default App;



// https://upload.wikimedia.org/wikipedia/commons/e/ec/Woman_7.jpg
// console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
  // componentDidMount() {
  //   fetch("http://localhost:4000")
  //     .then(response => response.json())
  //     .then(console.log)
  // }