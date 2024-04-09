import React, { useEffect, useState } from "react";
import {
  SettingOutlined,
  CompassOutlined,
  SlackSquareFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";

const Layoute: React.FC = (
  //@ts-ignore
  { config, children }
) => {
  const { Header, Content, Footer, Sider } = Layout;
  const [activeLang, setActiveLanguage] = useState();
  const [menu, setMenu] = useState();

  function t(keyword) {
    if (activeLang) {
      //@ts-ignore
      if (activeLang.hasOwnProperty(keyword)) {
        return activeLang[keyword];
      } else {
        // Retourner le mot-clé tel quel s'il n'y a pas de traduction
        return keyword;
      }
    }
  }

  useEffect(() => {
    if (config !== null) {
      console.log(config.menu);
      const activeLanguage = config.configs.active_language;
      const languages = config.languages;
      if (activeLanguage in languages) {
        // Si la langue est présente, parcourir les données
        const activeLanguageData = languages[activeLanguage];
        setActiveLanguage(activeLanguageData);

        /*for (const key in activeLanguageData) {
          if (activeLanguageData.hasOwnProperty(key)) {
            console.log(`${key}: ${activeLanguageData[key]}`);
          }
        }*/
      } else {
        console.log(
          "La langue active n'est pas disponible dans la liste des langues."
        );
      }
    }
  }, [config]);
  const items: MenuProps["items"] = Array.from(config.menu).map(
    (item: { title: string; icone: string }, index) => ({
      key: String(index + 1),
      icon: (
        <img
          style={{ width: 20, height: 20, aspectRatio: 1 }}
          src={`/images/${item.icone}`}
          alt={item.title}
        />
      ),
      label: t(item.title),
    })
  );

  const [float, setFloat] = useState(false);

  return (
    <Layout hasSider={float}>
      {/*<Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: float ? 40 : "auto",
        }}
      >
        <div
          onClick={() => setFloat(!float)}
          style={{ paddingBottom: 20, borderBottom: "1px solid #ccc" }}
        >
          <img
            style={{ height: 30, width: 30 }}
            src="/images/vigneb.png"
            alt="Vigne"
          />
          <span style={{ fontSize: 27, color: "#fff" }}>Vigne</span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          inlineCollapsed={float}
        />
        <Menu
          defaultSelectedKeys={["1"]}
          // defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={float}
          items={items}
        />
      </Sider>*/}
      <Layout style={{ marginLeft: 200, position: "relative" }}>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            minHeight: "97vh",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              /*background: colorBgContainer,
              borderRadius: borderRadiusLG,*/
              overflow: "auto",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Vigne ©{new Date().getFullYear()} Created by Cellsflux .inc
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Layoute;
