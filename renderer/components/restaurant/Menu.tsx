import React, { useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";

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

const items = [
  {
    label: "foo",
  },
];

const Menurestau: React.FC = ({
  data,
  setProductFilter,
  product,
}: {
  data: Array<String | Object>;
  setProductFilter: (item: string | any) => void;
  product: any;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div style={{ width: 200, alignItems: "center", justifyContent: "center" }}>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme={"light"}
        inlineCollapsed={collapsed}

        // items={data.cluster.documents.category_product_restau}
      >
        {data.cluster.documents.category_product_restau.map((item, i) => (
          <Menu.Item
            key={i}
            onClick={() => {
              setProductFilter(product);
              item.label !== "All"
                ? setProductFilter((prev) =>
                    prev.filter((ite) =>
                      ite.categorie
                        .toLowerCase()
                        .includes(item.label.toLowerCase())
                    )
                  )
                : setProductFilter(product);
            }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default Menurestau;
