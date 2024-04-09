import React, { useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";

import "antd/dist/antd.css";
import { ObjectContext } from "../globales/Context";

function MyApp({ Component, pageProps }: AppProps) {
  const [config, setConfig] = useState<Object | any>(null);
  return (
    <ObjectContext.Provider
      value={{
        config,
        setConfig,
      }}
    >
      <React.Fragment>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </React.Fragment>
    </ObjectContext.Provider>
  );
}

export default MyApp;
