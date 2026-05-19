import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import TokenCards from "./TokenCards";
import SessionContent from "./SessionContent";

function App() {
  const [mode, setMode] = useState('session')

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Tabs value={mode} onValueChange={setMode} className="w-full max-w-5xl">
        <TabsList className="w-full">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="token">Token</TabsTrigger>
        </TabsList>
        <TabsContent value="session">
          <SessionContent />
        </TabsContent>
        <TabsContent value="token">
          <TokenCards />
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default App;
