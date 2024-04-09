import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Result } from "antd";

const { Header, Content } = Layout;

export default function NextPage() {
  const [mess, setMemess] = useState<string>("pas de nessage");

  useEffect(() => {
    window.ipc.on("message", (mess: string) => {
      setMemess(mess);
    });
  }, []);
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-ant-design)</title>
      </Head>

      <Header>
        <Link href="/home">
          <a>Go to home page</a>
        </Link>
      </Header>

      <Content style={{ padding: 48 }}>
        <Result status="success" title="Nextron" subTitle="with Ant Design" />
        <button onClick={() => window.ipc.send("message", "this is work")}>
          Gettmesseage
        </button>
        <span>{mess}</span>
      </Content>
    </React.Fragment>
  );
}
