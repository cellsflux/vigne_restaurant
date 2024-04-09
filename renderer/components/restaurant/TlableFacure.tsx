import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  InputNumber,
  Divider,
  Typography,
  PageHeader,
  message,
} from "antd";
import Title from "antd/lib/typography/Title";
import {
  generateUniqueRandomNumbers,
  formatNumber,
} from "../../globales/Fuctions";
import { useConfig } from "../../globales/Context";
import { exitCode } from "process";

type InputRef = GetRef<typeof Input>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  qt: number;
  pu: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const { Text } = Typography;

const TableFacture: React.FC = ({
  product,
  setProduct,
  data,
}: {
  product: [] | Array<Object | DataType | []>;
  setProduct: (data: any) => void;
  data: any;
}) => {
  const [count, setCount] = useState(Math.random());
  const { setConfig } = useConfig();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = (key: React.Key) => {
    const newData = product.filter((item) => item.key !== key);
    setProduct(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "Qte",
      dataIndex: "qt",
      editable: true,
    },
    {
      title: "Pu",
      dataIndex: "pu",
      editable: true,
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        product.length >= 1 ? (
          <a
            onClick={() => handleDelete(record.key)}
            //onClick={()=>}
            style={{
              cursor: "pointer",
            }}
          >
            X
          </a>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: Math.random(),
      name: `Produit`,
      qt: 1,
      pu: 500,
    };
    setProduct([...product, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...product];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setProduct(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  var currentDate = new Date();
  var formattedDate = currentDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [factureId, setFactureId] = useState<[] | string>();
  useEffect(() => {
    //@ts-ignore
    setFactureId(generateUniqueRandomNumbers(5, 1, 10));
  }, []);

  //FACTURATION ACTIONS
  //FACTURATION ACTIONS
  const peyerSansPrinter = async () => {
    setLoading(true);

    try {
      const databaseProduct = [...data];
      const facture = [...product];
      const newdataFacture = [];
      const updatePromises = [];
      let data_update = [];

      for (const itemfact of facture) {
        for (const item of databaseProduct) {
          if (
            item.name.toLocaleLowerCase() === itemfact.name.toLocaleLowerCase()
          ) {
            if (item.qt !== undefined && item.qt !== null) {
              if (Number(item.qt) - Number(itemfact.qt) >= 0) {
                const newqt = Number(item.qt) - Number(itemfact.qt);
                // Ajouter une référence à l'objet existant dans data_update avec la quantité mise à jour
                data_update.push({ ...item, qt: newqt });
                newdataFacture.push(itemfact);
              } else {
                message.warning(
                  `Vous pouvez vendre jusqu'à ${item.qt}. Vous ne pouvez pas vendre plus que ce qui est disponible en stock. Veuillez approvisionner.`
                );
                setLoading(false);
                return;
              }
            } else {
              newdataFacture.push(itemfact);
              data_update.push(item);
            }
          }
        }
      }
      const nonDisponibles = databaseProduct.filter(
        (item) =>
          !facture.some(
            (itemfac) =>
              item.name.toLocaleLowerCase() === itemfac.name.toLocaleLowerCase()
          )
      );

      let data_sent = data_update.concat(nonDisponibles);

      const updatePromise = new Promise((resolve, reject) => {
        window.ipc.send("update_product_restau", data_sent);
        window.ipc.on("update_product_restau", (result) => {
          if (result.message === "success") {
            resolve();
          } else {
            message.warning("Erreur lors de la mise à jour du produit");
            reject(new Error("Erreur lors de la mise à jour du produit"));
          }
        });
      });
      updatePromises.push(updatePromise);

      /**/

      // Attendre que toutes les mises à jour soient terminées
      await Promise.all(updatePromises);

      const date = new Date();
      const factId = parseInt(factureId.join(""));

      const generatePromise = new Promise((resolve, reject) => {
        window.ipc.send("generate_facture_restaurant", {
          date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
          factId: factId,
          data: newdataFacture,
        });
        window.ipc.on("generate_facture_restaurant", (result) => {
          if (result.error) {
            message.warning(result.message);
          } else {
            message.success(result.message);
            setConfig(result.data);
            setProduct([]);
            resolve();
          }
        });
      });

      await generatePromise;
      setLoading(false);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      setLoading(false);
    }
  };

  const peyerAvecPrinter = () => {
    message.info("Coming soon");
  };

  return (
    <div style={{ width: "100%" }}>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Ajouter manuellement
  </Button>*/}
      <div
        className="FACTURE_INVOICE_PRINTER"
        style={{ backgroundColor: "#fff", width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",

            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 4,
          }}
        >
          <Title level={2}>Amani</Title>
          <small>Facture: {factureId} </small>

          <Title level={5} style={{ marginBottom: 0 }}>
            Restaurant & Bar
          </Title>
          <Title level={5} style={{ marginBottom: 0 }}>
            Date: {formattedDate}
          </Title>
          <Title level={5} style={{ marginBottom: 0 }}>
            Watssaps: 0829100597
          </Title>
          {/* Ajoutez d'autres détails d'entreprise ou de facture ici si nécessaire */}
        </div>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered={false}
          dataSource={product}
          columns={columns as ColumnTypes}
          style={{ fontSize: 14 }}
          pagination={false}
          size="small"
          summary={(pageData) => {
            let totalBorrow = 0;
            let totalRepayment = 0;
            let totalAmout = 0;

            pageData.forEach(({ qt, pu }) => {
              totalBorrow += Number(qt);
              totalRepayment += Number(pu);
              totalAmout += Number(qt) * Number(pu);
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Sous total</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text style={{ fontWeight: "bold" }}>{totalBorrow} X </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Text style={{ fontWeight: "bold" }}>
                      {formatNumber(totalRepayment)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Montant</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={2}>
                    <Text style={{ fontWeight: "bold" }}>
                      {formatNumber(totalAmout)}
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
        <br />
        <br />

        <div
          style={{
            display: "flex",
            gap: 30,
            padding: 10,
            width: "100%",
            justifyContent: "space-between",
          }}
        ></div>

        <Button
          onClick={() => peyerSansPrinter()}
          disabled={product.length < 1}
          type="primary"
          style={{ marginBottom: 16, marginRight: 16 }}
          loading={loading}
        >
          Payer
        </Button>
        <Button
          onClick={() => peyerAvecPrinter()}
          disabled={product.length < 1}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Payer et Imprimer
        </Button>
      </div>
    </div>
  );
};

export default TableFacture;
