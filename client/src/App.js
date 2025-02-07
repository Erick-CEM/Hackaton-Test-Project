import socket from './socket';
import './App.css';

function App() {
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  const handleVote = (option) => {
    socket.emit('vote', option);
  };

  const [votes, setVotes] = useState({});

  const options = [0, 1, 1, 2, 3, 5, 8, 13, 21];
  const [reveal, setReveal] = useState(false);

  const calculateAverage = () => {
    const totalVotes = Object.entries(votes).reduce((acc, [key, value]) => acc + key * value, 0);
    const totalCount = Object.values(votes).reduce((acc, value) => acc + value, 0);
    return totalCount ? (totalVotes / totalCount).toFixed(2) : 0;
  };

  const resetVotes = () => {
    setVotes({});
    setReveal(false);
  };


  useEffect(() => {
    if (timer === 0) {
      setReveal(true);
    }
  }, [timer]);

  useEffect(() => {
    socket.on('revealVotes', (finalVotes) => {
      setVotes(finalVotes);
      setReveal(true);
    });


    socket.on('voteUpdate', (updatedVotes) => {
      setVotes(updatedVotes);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={require('./rock_pillow.jpg')} className="App-logo" alt="The Rock Pillow" />
        <div>
          {options.map((option) => (
            <button key={option} onClick={() => handleVote(option)} className="poker-card">
              {option}
            </button>
          ))}
          <button onClick={resetVotes} className="reset-button">Reset Votes</button>
        </div>
        <div>
          {reveal && <h2>Average Vote: {calculateAverage()}</h2>}
          {reveal && <h2>Final Vote Counts:</h2>}
          {!reveal && <h2>Vote Counts:</h2>}

          <p>Option 1: {votes['option1'] || 0}</p>
          <p>Option 2: {votes['option2'] || 0}</p>
        </div>
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
      </header>
    </div>
  );
}

export default App;
