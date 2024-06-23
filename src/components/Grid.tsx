import { useState, useEffect, useMemo } from "react";

// the directions to spread the bacteria
const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1]
];

// the maximum grid row, column and interval time
const maxGridRow = 100;
const maxGridCol = 100;
const maxIntervalTime = 10;

const Grid = () => {
  const [state, setState] = useState({
    rowN: 20,
    colN: 20,
    tempRowN: 20,
    tempColN: 20,
    timeInterval: 1000,
    tempTimeInterval: 1000,
    blueGrid: 'blue',
    greenGrid: 'white',
    tempRowNError: '',
    tempColNError: '',
    tempTimeIntervalError: '',
    submitSuccessfully: false,
    openSett: false,
    openControl: false,
    counter: 0,
  });
  const [start, setStart] = useState(false);
  // svg grid size
  const gridSize = 800;

  // creates an empty grid
  const emptyGrid = (rows = state.rowN, cols = state.colN) => {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(Array.from(Array(cols), () => 0));
    } 
    return grid;
  };

  // initial grid saves the initial grid state, so grid and history can be reset
  const initialGrid = useMemo(() => emptyGrid(state.rowN, state.colN), [state.rowN, state.colN]);
  // the main grid, color blue
  const [grid, setGrid] = useState(initialGrid);
  // the history of the grid and future, used fore prediction, color green
  const [history, setHistory] = useState([initialGrid]);

  // takes a grid = number[][] and returns a new grid with the bacteria spread
  const spread = (currentGrid = grid) => {
    const newGrid = currentGrid.map(rows => [...rows]);
    currentGrid.forEach((rows, i) => {
      rows.forEach((cell, j) => {
        if (cell) {
          directions.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < state.rowN && newJ >= 0 && newJ < state.colN) {
              newGrid[newI][newJ] = 1;
            }
          });
        }
      });
    });
    return newGrid;
  };

  // check if the grid is full, returns true if grid is full, false otherwise
  const isGridFull = (currentGrid : number[][]) => {
    return !currentGrid.some(row => row.some(cell => cell === 0));
  };

  // increments the history grid, to predict and return the next grid
  const nextGrid = () => {
    const currentGrid = history[state.counter];
    const newGrid = spread(currentGrid);
    const newHistory = [...history.slice(0, state.counter + 1), newGrid];
    setHistory(newHistory);
    setState(prevState=> ({
      ...prevState,
      counter: state.counter + 1
    }));   
  }

  // increments the history grid, return the previous grid
  const prevGrid = () => {
    if (state.counter > 0) {
      setState(prevState=> ({
        ...prevState,
        counter: state.counter - 1
      }));       }
  };

  // start the simulation
  const startSimulation = () => {
    setStart(!start);
  };

  // updates the grid when a change happens
  useEffect(() => {
    if (!start) return;
    const intervalId = setInterval(() => {
      setGrid((oldGrid) => {
        if (isGridFull(oldGrid)) { 
          clearInterval(intervalId); 
          setStart(false);
          return oldGrid; 
        }
        return spread(oldGrid);
      });
    }, state.timeInterval);

    return () => clearInterval(intervalId);
  }, [start, spread, state.timeInterval]);

  // checks if the user press the spacebar to start the simulation
  useEffect(() => {
    const handleKeyDown = (event : any) => {
      if (event.key === " " || event.key === "Spacebar") { 
        event.preventDefault();
        startSimulation();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [start]);

  // checks if the user press the r or enter key to reset
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "r" || event.key === "Enter") { 
        event.preventDefault();
        resetSimulation();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // checks if the user press the right or left arrow key to move to the next or previous grid
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextGrid();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevGrid();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.counter, nextGrid, prevGrid]);

  // reset the simulation
  const resetSimulation = () => {
    setState(prevState => ({
      ...prevState,
      rowN: prevState.tempRowN,
      colN: prevState.tempColN,
      timeInterval: prevState.tempTimeInterval * 1000,
    }));
    const newGrid = emptyGrid();
    setGrid(newGrid);
    setStart(false);
    setHistory([newGrid]);
    setState(prevState=> ({
      ...prevState,
      counter: 0
    }));   
  };

  // change the main grid color
  const changeMainGridColor = () => {
    if (state.blueGrid === 'blue') {
      setState(prevState=> ({
        ...prevState,
        blueGrid: 'white'
      }));
    } else {
      setState(prevState=> ({
        ...prevState,
        blueGrid: 'blue'
      }));    
    }
  };

  // change the history grid color
  const changeSecondGridColor = () => {
    if (state.greenGrid === 'white') {
      setState(prevState=> ({
        ...prevState,
        greenGrid: 'green'
      }));
    } else {
      setState(prevState=> ({
        ...prevState,
        greenGrid: 'white'
      }));
    }
  };

  // error messages
  const validateInput = (value : number, min : number, max : number) => {
    if (!Number.isFinite(value)) return 'Value must be a number';
    if (value < min || value > max) return `Value must be between ${min} and ${max}`;
    return '';
  };

  // handle the row change
  const handleRowChange = (e : any) => {
    const value = Number(e.target.value);
    const error = validateInput(value, 0, maxGridRow);
    setState(prevState=> ({
      ...prevState,
      tempRowNError: error
    }));    
    if (!error) setState(prevState => ({ ...prevState, tempRowN: value }));
  };

  // handle the column change
  const handleColChange = (e : any) => {
    const value = Number(e.target.value);
    const error = validateInput(value, 0, maxGridCol);
    setState(prevState=> ({
      ...prevState,
      tempColNError: error
    }));        
    if (!error) setState(prevState => ({ ...prevState, tempColN: value }));
  };

  // handle the time interval change
  const handleTimeIntervalChange = (e : any) => {
    const value = Number(e.target.value);
    const error = validateInput(value, 0, maxIntervalTime);
    setState(prevState=> ({
      ...prevState,
      tempTimeIntervalError: error
    }));        
    if (!error) setState(prevState => ({ ...prevState, tempTimeInterval: value * 1000 }));
  };

  // handle submitting
  const handleSubmit = async (event : boolean) => {
    setState(prevState=> ({
      ...prevState,
      submitSuccessfully: true
    }));     

    setTimeout(() => {
      setState(prevState=> ({
        ...prevState,
        submitSuccessfully: false
      }));   
    }, 3000);
  }

  return (
    <div className="container">
      <div className="main-section">
        <div className="nav">
          <div className="open" onClick={() => 
            {
              setState(prevState=> ({
                ...prevState,
                openSett: true
              }));   
            }
          }>Settings</div> 
          {state.openSett && (
              <div className="settings">
                <div className="modal_header">
                  <div  className="close" onClick={() => 
                    {
                      setState(prevState=> ({
                        ...prevState,
                        openSett: false
                      }));   
                    }
                  }>X</div>
                </div>
                <form
                  className="form"
                  style={{float: "left", width:"100%"}}
                  onSubmit={(e) => {
                    e.preventDefault();
                    resetSimulation();
                    handleSubmit(true)
                  }}>
                    <div className="model_body">
                      <span>Time interval (1-10): </span>
                      <input
                        className="input"
                        value={state.tempTimeInterval / 1000}
                        onChange={handleTimeIntervalChange}
                        placeholder="Time Interval"
                        // step="1"
                        // min="1"
                        // max="10"
                      />
              
                      <span>Enter Row Count (1-100): </span>
                      <input
                        className="input"
                        value={state.tempRowN}
                        onChange={handleRowChange}
                        placeholder="Enter Row count"
                        // step="10"
                        // min="0"
                        // max="100"
                      />
              
                      <span>Enter Column Count (1-100): </span>
                      <input
                        className="input"
                        value={state.tempColN}
                        onChange={handleColChange}
                        placeholder="Enter Column count"
                        // step="10"
                        // min="0"
                        // max="100"
                      />
                      </div>

                      {state.tempTimeIntervalError && <div className="error">{state.tempTimeIntervalError}</div>}
                      {state.tempRowNError && <div className="error">{state.tempRowNError}</div>}
                      {state.tempColNError && <div className="error">{state.tempColNError}</div>}
                      {state.submitSuccessfully && <div className="success" style={{color: "green"}}>Submitted Successfully</div>}

                      <div className="modal_footer" style={{width:"100%", float: "left", height:"42px", borderTop: "1px solid #eee"}}>
                      <button type="submit" className="button" onClick={resetSimulation}>Submit</button>
                  </div>
                </form>
              </div>
          )}
          <div className="open" onClick={() => 
            {
              setState(prevState=> ({
                ...prevState,
                openControl: true
              }));   
            }
          }>Controls</div> 
          {state.openControl && (
              <div className="controls">
                <div className="modal_header">
                  <div className="close" onClick={() => 
                    {
                      setState(prevState=> ({
                        ...prevState,
                        openControl: false
                      }));   
                    }
                  }>X</div>
                </div>
                <form
                  className="form"
                  style={{float: "left", width:"100%"}}
                  onSubmit={(e) => {
                    e.preventDefault();
                    resetSimulation();
                  }}>
                    <div className="keyboard-rules">
                        <span>Keyboard Shortcuts:</span>
                          <ul>
                            <li><strong>Spacebar:</strong> Start/Pause the simulation</li>
                            <li><strong>R or Enter:</strong> Reset the simulation</li>
                            <li><strong>ArrowRight:</strong> Move to the next grid state</li>
                            <li><strong>ArrowLeft:</strong> Move to the previous grid state</li>
                          </ul>
                    </div>
                </form>
              </div>
          )}
        </div>
        
        <div className="grid-wrapper">
          <svg className="grid" style={{ width: `${gridSize}px`, height: `${gridSize}px` }}>
            {grid.map((rows, i) =>
              rows.map((cell, j) => (
                <rect
                  key={`${i}-${j}`}
                  x={j * (gridSize / state.colN)}
                  y={i * (gridSize / state.rowN)}
                  width={gridSize / state.colN}
                  height={gridSize / state.rowN}
                  fill={grid[i][j] ? (state.blueGrid === "white" && history[state.counter][i][j] ? state.greenGrid : state.blueGrid) : (history[state.counter][i][j] ? state.greenGrid : 'white')}
                  onClick={() => {
                    const newGrid = grid.slice();
                    newGrid[i][j] = grid[i][j] ? 0 : 1;
                    setGrid(newGrid);

                    const newHistoryGrid = [...history[state.counter]];
                    newHistoryGrid[i] = [...newHistoryGrid[i]];
                    newHistoryGrid[i][j] = newGrid[i][j];
                    const newHistory = [...history.slice(0, state.counter + 1), newHistoryGrid];
                    setHistory(newHistory);
                    setState(prevState=> ({
                      ...prevState,
                      counter: state.counter + 1
                    }));   
                  }}
                />
              ))
            )}
          </svg>
        </div>

        <div className="main-section">
          <div className="first-functions">
              <button className={`button ${start ? 'start' : ''}`} onClick={startSimulation}>{start ? 'Pause' : 'Start'}</button>
              <button className="button" onClick={resetSimulation}>Reset</button>
            </div>
            
            <div className="second-functions">
              <span>Backterial Growth Spread Over Time: </span>
              <button className="color-button blue" style={{ backgroundColor: state.blueGrid }} onClick={changeMainGridColor}>.</button>
              <span>Backterial Growth Pattern Expected: </span>
              <button className="color-button green" style={{ backgroundColor: state.greenGrid }} onClick={changeSecondGridColor}>.</button>
              <button className="button" onClick={prevGrid} disabled={state.counter === 0}>Prev</button>
              <button className="button" onClick={nextGrid}>Next</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Grid;