import logo from './logo.svg';
import './App.css';
import MarsImages from './MarsImages';

const App = () => {

  // useEffect(() => {
  //   fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=cPmB3PNZCJGbJ8YYWhA7m8hbYu0z4yqxSoai7cu1')
  //     .then(result => result.json())
  //     .then(console.log(result))
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <MarsImages />
      </header>
    </div>
  );
}

export default App;
