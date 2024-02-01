import "./App.scss";
import Radio from "./Radio";

function App() {

  const toggleTheme = () => {
    const body = document.querySelector('body')
    body.classList.toggle('dark')
  }

  return (
    <div className="App dark:bg-gray-900 dark:text-white">
      <nav className="sticky top-0">
        <button
          className="px-2 py-1 bg-blue-300 text-red-700"
          onClick={() => toggleTheme()}
          >
            Switch Theme
        </button>
      </nav>

      <h1>Radio Station</h1>
      <h2>Listen to your favorites!</h2>
      <Radio />
    </div>
  );
}

export default App;