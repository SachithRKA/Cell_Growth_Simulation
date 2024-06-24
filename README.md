### Project Overview

The project **Cell Growth Simulation** simulates the growth patterns of bacterial colonies within a confined space. This interactive application demonstrates how bacterial cells divide and spread based on specific biological rules. The project is built solely using TypeScript, without any third-party packages.

#### Link to GitHub pages: https://sachithrka.github.io/Cell_Growth_Simulation/

### Features

1. **Grid Simulation**
   - A grid of 800px size that simulates a petri dish, where each section of the grid represents a cell.
   - Cells divide at fixed time intervals into empty adjacent cells (up, down, left, right).

2. **User Interaction**
   - Users can simulate an environment by clicking the grid to add bacterial cells.
   - **Start Button:** Starts the simulation. When running, the button turns green and changes to a pause button, allowing the user to pause the simulation.
   - **Auto-stop:** The simulation stops automatically once the bacteria fill the grid.
   - **Reset Button:** Resets the simulation to its initial state.
   - **Settings Section:** Allows users to adjust the time interval, row count, and column count.

3. **Bacterial Growth Visualisation**
   - The primary bacterial growth, called "Growth Over Time" is shown in blue. Users can disable this visualization.
   - An alternative view, "Predicted Growth Pattern" is shown in green. Users can navigate through expected future and past grid states spread using the previous and next buttons.

4. **Keyboard Shortcuts**
   - **Spacebar:** Start/Pause the simulation.
   - **R or Enter:** Reset the simulation.
   - **Arrow Right:** Move to the next grid state.
   - **Arrow Left:** Move to the previous grid state.

5. **Accessibility**
   - Buttons and text include descriptions for screen reader compatibility, enhancing accessibility.

6. **Performance Optimisation**
   - The application is optimized to run on SVG, ensuring fast performance.

### Local Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/SachithRKA/Cell_Growth_Simulation.git
   ```

2. **Install Dependencies**
   Navigate to the project directory and run:
   ```bash
   cd Cell_Growth_Simulation
   
   npm install
   ```

### Running the Application
1. **Start the Server**
   ```bash
   npm start
   ```

2. **Access the Website**
   Open your web browser and go to if it did not auto start a web browser:
   ```
   localhost:3000
   ```

### Project Structure

```
CellGrowthSimulation/
├── public/
│   └── index.html
├── src/
│   ├── Components/
|	|     └──Grid.tsx
│   └── App.tsx
├── package.json
└── README.md
```

Key Components in Grid.tsx:

Grid : Number[][]
History: Number [][][]


emptyGrid(row, col)
Creates a 2D array filled with 0s to represent an empty grid.
Parameters:
- row: Number of rows in the grid. Type: Number
- col: Number of columns in the grid. Type : Number
Returns: A 2D array of numbers representing the empty grid. Type: Number[][]

spread(grid: number[][]):
Simulate a bacterial spread. For each cell, it checks adjacent cells;
if an adjacent cell is 0, it sets it to 1 to indicate the bacteria has spread to that cell.
Parameters:
- grid: The current state of the grid. Type : number[]
Returns: A new grid state after simulating the spread. Type:  Number[][]

isGridFull(grid: number[][]): 
Checks if all cells in the grid are filled with value 1.
Parameters:
- grid: The grid to check. Type: Number[][]
Returns: true if the grid is full, false otherwise. Type: boolean

nextGrid():
Advances the current History Grid's spread to the next state and adds the grid to the end of History Grid. 

prevGrid():
Moves the state of History to its previous state.

startSimulation():
Toggles the simulation between start and pause states.

useEffects:
1. Updates the grid based on user interaction or time interval changes.
2. Registers an event listener for the "Spacebar" key to control the simulation.
3. Registers event listeners for the "Enter" and "R" keys for specific actions.
4. Registers event listeners for the arrow keys ("<-" and "->") to navigate through the grid history.

resetSimulation():
Resets all states to their initial values, effectively resting the grid screen to its initial value.  

changeMainGridColor():
Alternates the color of the main Grid between two states based on the user.

changeSecondGridColor():
Alternates the color of the history grid between two states based on the user.

validateInput(value: number, min: number, max: number): boolean
Check if a given value falls within a specified range or not, if not return an error message to show.
Parameters:
- value: The value to validate. Type: number
- min: The minimum allowable value. Type: number
- max: The maximum allowable value. Type: number
Returns: Returns a string of error messages. Type: ''
  
handleRowChange(e: Event):
Updates the number of rows in the grid based on user input.
Parameters:
- e: The event object from the input field. 

handleColChange(e: Event):
Updates the number of columns in the grid based on user input.
Parameters:
- e: The event object from the input field.

handleTimeIntervalChange(e: Event): void
Adjusts the time interval for the bacteria spread simulation based on user input.
Parameters:
- e: The event object from the input field.

handleSubmit(e: Event): void
Handles the submission of user inputs from the settings section.
Parameters:
- e: The event object from the submit action.

### Assumptions and Additional Features Implemented: 

##### Assumptions:

1. The first assumption I made was that the user starts with an empty petri dish or an empty grid. I made this assumption, so the user can simulate the playground according to his preference. 
2. The second assumption I made was that the spread stops once the grid is filled with bacteria. Since the grid constantly has to run even when it is already full, to save memory, the spread stops after it fills up.
3. Initially, the grid was presented using `<div>` tags. This consumed a large amount of memory when the rows and columns were scaled. So, I assumed that replacing `<div>` elements with SVG would significantly save memory since images are easier to render.

##### Additional Features:

1. A Settings tab so that users can change the inputs in a separate section.
2. A Controls tab so that users can see the keyboard controls in a separate section. Furthermore, the keyboard control design enables users fast and easy actions.
3. A separate spread pattern to show the expected bacterial growth in the future and past states. With intuitive buttons that are navigable using both the keyboard and mouse, making it easier for the user.

### Performance Analysis/Review:

**Old Grid:**
1. The grid was rendered using `<div>` elements for each grid cell.

**Improved:**
1. **Switch from `<div>` to SVG**: The previous method of rendering the grid used `<div>` elements for each cell. To enhance performance, I switched to using SVG. This change leverages the efficient rendering capabilities of SVG for complex graphics.
2. **Optimised Computation**: The application now stops the metric calculations once the bacteria cover the entire grid, reducing unnecessary computations.
3. **State Management**: The state management in the application has been optimized to minimize unnecessary updates and re-renders.
4. **Memoization**: When the user resets the grid to the same size, the application uses cached results for identical inputs, reducing the need for redundant calculations.

The image shows the performance calculations from the Chrome DevTools Performance tab. These metrics represent the time taken for rendering and system operations before and after the improvements.

##### Metrics Explanation:
- **Rendering**: The time it takes to render the grid and handle re-renders as the bacteria spread.
- **System**: The time spent on system-level operations, such as garbage collection and other internal processes.

##### Performance Comparison:


![[Screenshot from 2024-06-23 22-31-12 1.png]]

**Rendering Time Improvement**:
- 50x50 grid: Reduced from 403 ms to 185 ms (54% improvement).
- 60x60 grid: Reduced from 524 ms to 255 ms (51% improvement).
- 100x100 grid: Reduced from 1621 ms to 507 ms (69% improvement).

**System Time Improvement**:
- 50x50 grid: Reduced from 544 ms to 431 ms (21% improvement).
- 60x60 grid: Reduced from 684 ms to 409 ms (40% improvement).
- 100x100 grid: Reduced from 827 ms to 528 ms (36% improvement).

The Improved grid performs better because the improvements reduced both rendering and system times across all tested grid sizes. Indicating that the application is now more efficient and performs different grid dimensions. Furthermore, it also has a high user experience because with the use of SVG, the application has faster rendering times making it more responsive to users. It has 50% faster rendering time, making it less likely to cause performance issues to the user.

Author: Sachith Ranaweera
