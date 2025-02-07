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

  const [timer, setTimer] = useState(30);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

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
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <button onClick={() => handleVote('option1')}>Vote for Option 1</button>
          <button onClick={() => handleVote('option2')}>Vote for Option 2</button>
        </div>
        <div>
          <h2>Time Remaining: {timer} seconds</h2>
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
