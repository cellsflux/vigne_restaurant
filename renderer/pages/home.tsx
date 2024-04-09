import { Grid, Layout } from "antd";
import React, { useEffect, useState } from "react";
import Layoute from "../components/Layoute";
import Gride from "../components/restaurant/Gride";
import { useConfig } from "../globales/Context";

export default function HomePage() {
  const [loadConfig, setLoadConfig] = useState<Object | any>(null);
  const { setConfig, config } = useConfig();
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    window.ipc.send("config", "connextion");
    window.ipc.on("config", (config) => {
      setConfig(config);
    });
  };

  return (
    <>
      {config && <Layoute config={config} children={<Gride data={config} />} />}
    </>
  );
}
