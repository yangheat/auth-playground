import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import TokenCards from "./TokenCards";
import SessionContent from "./SessionContent";

function App() {
  const [mode, setMode] = useState('session')

  return (
    <>
      <Tabs value={mode} onValueChange={setMode}>
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
    </>
  );
}

export default App;
