import React, { useEffect, useState } from "react";
import Menurestau from "./Menu";
import Sider from "antd/lib/layout/Sider";
import Head from "next/head";
import {
  Divider,
  Row,
  Col,
  Button,
  Layout,
  Input,
  Space,
  Card,
  DatePicker,
  Drawer,
  Form,
  Select,
  Typography,
  message,
  Popconfirm,
  Table,
} from "antd";
import {
  FileOutlined,
  PlusOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { SearchProps } from "antd/es/input/Search";
import TableFacture from "./TlableFacure";
import FormAddProduct from "./AddProduct";
import {
  formatNumber,
  generateUniqueRandomNumbers,
} from "../../globales/Fuctions";
import AddCate from "./AddCate";
import FilesMenu from "./Files";
import AddDepense from "./AddDepense";

const { Title } = Typography;

const { Option } = Select;

const { Meta } = Card;
const { Search } = Input;
const { Header, Content } = Layout;

export default function Gride({ data }: { data: Array<String | Object> }) {
  const [open, setOpen] = useState(false);
  const [startFacture, setStartFacture] = useState(false);
  const [dataFacture, setDataFacture] = useState<
    Array<[] | Object | null | string>
  >([]);

  const [productLoad, setProductLoad] = useState([]);
  const [productFilter, setProductFilter] = useState([]);

  const [showAddCat, setShowAddCat] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [modeldepense, setModaleDepense] = useState<Boolean>(false);

  useEffect(() => {
    setProductLoad(data.cluster.documents.products_restaurant);
    setProductFilter(data.cluster.documents.products_restaurant);
  }, [data]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const confirmCanseInvoice = (e: React.MouseEvent<HTMLElement>) => {
    message.success("facute Anuuler");
    setStartFacture(false);
    setDataFacture([]);
  };

  const cancelInvoice = (e: React.MouseEvent<HTMLElement>) => {
    //message.error("Click on No");
  };

  const AddProduct = (key: number, data) => {
    const new_data = {
      key: `${key}`,
      name: data.name,
      qt: 1,
      pu: Number(data.price),
    };
    const oldData = [...dataFacture];
    const insert = oldData.map((item) => {
      //@ts-ignore
      if (item.key === new_data.key) {
        //@ts-ignore
        return { ...item, qt: item.qt + new_data.qt }; // Mise à jour de la quantité
      } else {
        return item; // Laisser les autres éléments inchangés
      }
    });

    const isNewKey = insert.every((item) => item.key !== new_data.key); // Vérifier si la clé n'existe pas déjà dans les données
    if (isNewKey) {
      insert.push(new_data); // Ajouter la nouvelle donnée si la clé est nouvelle
    }

    setDataFacture(insert);
    setStartFacture(true);
  };
  return (
    <>
      <AddCate open={showAddCat} setOpen={setShowAddCat} />
      <AddDepense open={modeldepense} setOpen={setModaleDepense} />
      <Head>
        <title>Vigne Restaurant</title>
      </Head>

      <Layout
        style={{
          minHeight: "96vh",
          width: "100%",
        }}
      >
        <div
          style={{
            right: 0,
            height: 70,
            backgroundColor: "#fff",
            position: "fixed",
            top: 0,
            zIndex: 99,
            display: "flex",
            alignSelf: "flex-end",
            left: 0,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            gap: 50,
            //boxShadow: "3px 2px 3px 3px rgba(0,0,0,0.3)",
          }}
        >
          <Button
            style={{ marginRight: 50 }}
            type="primary"
            onClick={() => setOpenMenu(true)}
            icon={<FileOutlined />}
          >
            Ficher
          </Button>
          <Search
            placeholder="Chercher un Produit"
            allowClear
            onChange={(event) =>
              event.target.value.length > 0
                ? setProductFilter(
                    productFilter.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(event.target.value.toLowerCase())
                    )
                  )
                : setProductFilter(productLoad)
            }
            size="large"
            //style={{ width: 500 }}
          />

          <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            Add Product
          </Button>
          <Button
            type="primary"
            onClick={() => setShowAddCat(true)}
            icon={<PlusOutlined />}
          >
            Categorie
          </Button>
          <Button
            type="primary"
            onClick={() => setModaleDepense(true)}
            icon={<PlusOutlined />}
          >
            Ajouter une depenses
          </Button>
        </div>
        <Divider style={{ height: 10 }} />

        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 10,
            bottom: 0,
            paddingTop: 30,
          }}
          theme="light"
        >
          <Divider />
          <Menurestau
            data={data}
            product={productLoad}
            setProductFilter={setProductFilter}
          />
        </Sider>
        <Layout style={{}}>
          <Content style={{ display: "flex" }}>
            <div
              style={{
                width: "100%",
                marginBottom: 48,
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Row gutter={[16, 16]} style={{ borderRadius: 10 }}>
                {productFilter &&
                  productFilter.length > 0 &&
                  productFilter.map((item, i) => {
                    return (
                      <Card
                        hoverable
                        style={{
                          width: 150,
                          padding: 5,
                          margin: 10,
                          borderRadius: 10,
                        }}
                        cover={
                          <img
                            alt="example"
                            style={{
                              height: "40%",
                              width: "100%",
                              borderRadius: 10,
                              aspectRatio: 1,
                            }}
                            src={item.image[0]}
                            onClick={() => AddProduct(i, item)}
                          />
                        }
                        actions={item.qt && [<span> Qte: {item.qt}</span>]}
                      >
                        <Meta
                          onClick={() => AddProduct(i, item)}
                          title={item.name}
                          description={formatNumber(Number(item.price))}
                        />
                      </Card>
                    );
                  })}
              </Row>
            </div>

            {startFacture && (
              <Row
                gutter={[16, 16]}
                style={{ width: 550, position: "relative" }}
              >
                <div
                  style={{
                    background: "#fff",
                    width: "100%",
                    minHeight: "50vh",
                    height: "fit-centent",
                    padding: 5,
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", width: "100%" }}>
                    <Popconfirm
                      title="Voulez vous Annuler cette facture?"
                      onConfirm={confirmCanseInvoice}
                      onCancel={cancelInvoice}
                      okText="Yes"
                      cancelText="No"
                      placement="bottomLeft"
                    >
                      <Button
                        //onClick={()=>}
                        style={{
                          cursor: "pointer",
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: "#d9d9d9",
                          display: "flex",
                          position: "absolute",
                          right: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          top: 10,
                        }}
                      >
                        X
                      </Button>
                    </Popconfirm>
                  </div>
                  <div style={{ width: "90%", wordBreak: "break-all" }}>
                    <TableFacture
                      product={dataFacture}
                      setProduct={setDataFacture}
                      data={productLoad}
                    />
                  </div>
                </div>
              </Row>
            )}
          </Content>
        </Layout>
      </Layout>

      <Drawer
        title="Ficher"
        placement={"left"}
        closable={false}
        onClose={() => setOpenMenu(false)}
        open={openMenu}
        key={"left"}
      >
        <FilesMenu data={data} />
      </Drawer>

      <Drawer
        title="Ajouter un Nouveau produit"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Annuler</Button>
            <Button onClick={onClose} type="primary">
              Enregistrer
            </Button>
          </Space>
        }
      >
        <FormAddProduct data={data} />
      </Drawer>
    </>
  );
}
