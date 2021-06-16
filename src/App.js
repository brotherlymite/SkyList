import './App.css';
import {Route, HashRouter} from "react-router-dom";
import Login from "./components/Login";
import MyList from "./components/myList";

function App() {
  
  return (
    <div >
      <HashRouter>
        <Route path="/" exact component={Login} />
        <Route path="/mylist/" exact component={MyList} />
      </HashRouter>
    </div>
  );
}

export default App;