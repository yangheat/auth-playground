import SessionCards from "./SessionCards";
import TokenCards from "./TokenCards";

function App() {
  return (
    <div className="flex justify-center items-center h-screen p-4 gap-4">
      <section className="w-full max-w-sm flex flex-col gap-4">
        <SessionCards />
      </section>
      <section className="w-full max-w-sm flex flex-col gap-4">
        <TokenCards />
      </section>
    </div>
  );
}

export default App;
