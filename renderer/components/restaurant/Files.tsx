import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  ForwardOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Button, Modal, Popconfirm, message } from "antd";
import Stok from "./Stok";
import { useConfig } from "../../globales/Context";
import Rapport from "./Rapport";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Restaurent", "sub1", <ForwardOutlined />, [
    getItem("Rapport", "1"),
    getItem("Gestion de stock", "2"),
  ]),
  getItem("Agences", "sub2", <AppstoreOutlined />, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
  ]),
  getItem("Beyond Dreams", "sub4", <SettingOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),
];

// submenu keys of first level
const rootSubmenuKeys = ["sub1", "sub2", "sub4"];

const FilesMenu = ({ data }) => {
  const [openKeys, setOpenKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [content, setContent] = useState<any>();
  const [title, setTitle] = useState("");
  const [close, setClose] = useState(false);
  const { setConfig } = useConfig();
  const [messageApi, contextHolder] = message.useMessage();

  const [dataSource, setDataSource] = useState<[]>([]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    console.log(latestOpenKey);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleClick = (e) => {
    setTitle("");
    setContent(undefined);
    const clickedKey = e.key; // Clé de l'élément cliqué
    const parentItem = items.find((item) => {
      // Recherche de l'élément parent contenant la clé cliquée dans ses enfants
      return (
        //@ts-ignore
        item.children && item.children.some((child) => child.key === clickedKey)
      );
    });

    if (parentItem) {
      // console.log("Clé de l'élément parent :", parentItem.key);
      // Recherche de l'élément correspondant à la clé cliquée
      //@ts-ignore
      const clickedItem = parentItem.children.find(
        (child) => child.key === clickedKey
      );
      if (clickedItem) {
        showModal();
        if (clickedItem.label == "Rapport") {
          setTitle("Rapports");
          setContent("Rapports");
        }
        if (clickedItem.label == "Gestion de stock") {
          setTitle("Gestion de Stock");
          setContent("Stock");
        }
      }
    } else {
      console.log("L'élément cliqué n'a pas de parent avec des enfants.");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      if (content == "Stock") {
        window.ipc.send("update_product_restau", dataSource);
        window.ipc.on("update_product_restau", (res) => {
          //@ts-ignore
          if (res.data) {
            //@ts-ignore
            setConfig(res.data);
            setTimeout(() => {
              setOpen(false);
              //@ts-ignore
              message.info(res.message);
              setConfirmLoading(false);
            }, 2000);
          }
        });
      }
    } catch (error) {}
  };

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={handleOk}
        okText={content === "Rapport" ? "ok" : "Enregister les modifications"}
        cancelText={content === "Rapport" ? "Back" : "Annuler"}
        confirmLoading={confirmLoading}
        onCancel={() => setClose(true)}
        width={"90%"}
      >
        {content === "Stock" && (
          <Stok
            data={data}
            dataSource={dataSource}
            setDataSource={setDataSource}
          />
        )}
        {content === "Rapports" && <Rapport />}
      </Modal>
      <Popconfirm
        open={close}
        style={{ margin: 100 }}
        title={
          content === "Rapport"
            ? "Voulez vous fermer ?"
            : "Est-vous sur de bien vouloir annuler toutes les modifications?"
        }
        onCancel={() => setClose(false)}
        onConfirm={() => {
          setOpen(false);
          setClose(false);
        }}
      />
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ width: 256 }}
        onClick={(e) => handleClick(e)}
        items={items}
      />
    </>
  );
};

export default FilesMenu;
